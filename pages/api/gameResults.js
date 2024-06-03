import { ComposeClient } from '@composedb/client';
import { CeramicClient } from '@ceramicnetwork/http-client'
import { definition } from '../../src/__generated__/definition';
import { fromString } from 'uint8arrays/from-string'
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";

const handler = async (req, res) => {
    const ceramic = new CeramicClient(`${process.env.NEXT_PUBLIC_CERAMIC_URL}`)

    //instantiate a composeDB client instance
    const composeClient = new ComposeClient({
        ceramic: `${process.env.NEXT_PUBLIC_CERAMIC_URL}`,
        definition: definition
    });

    const {
        publicKey,
        cardsLearned,
        farcasterId
    } = req.body

    const uniqueKey = process.env.ADMIN_DID_KEY;

    //authenticate developer DID in order to create a write transaction
    const authenticateDID = async (seed) => {
        const key = fromString(seed, "base16");
        const provider = new Ed25519Provider(key);
        const staticDid = new DID({
            // @ts-expect-error: Ignore type error
            resolver: KeyResolver.getResolver(),
            provider
        });
        await staticDid.authenticate();
        ceramic.did = staticDid;
        return staticDid;
    }

    try {
        if (uniqueKey) {
            const did = await authenticateDID(uniqueKey);
            composeClient.setDID(did);
        }
    } catch (e) {
        console.log({ message: e.message })
    }

    const fetchPinata = async (url, method, body) => {
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return response.json();
    };

    const fetchApi = async (url, method, body) => {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return response.json();
    };

    const unpinFromPinata = async (hashToUnpin) => {
        const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            }
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error unpinning: ${text}`);
        }

        if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    };

    const updateCardsReviewed = (nodesArr, cardsLearned) => {
        const currentDate = new Date().toISOString();
        return nodesArr.map((node) => {
            const { id } = node;
            const cardCorrect = cardsLearned.find(card => card.cardId === id)?.correct;

            if (!cardCorrect) {
                return {
                    ...node,
                    timesForgotten: node.timesForgotten + 1,
                    lastReviewed: currentDate,
                    learningStatus: 'LEARNING'
                };
            } else {
                const timespanInMilliseconds = new Date(currentDate) - new Date(node.lastReviewed);
                const millisecondsInADay = 24 * 60 * 60 * 1000;
                const timeSpanInDays = Math.floor(timespanInMilliseconds / millisecondsInADay);

                if (timeSpanInDays > 30) {
                    return {
                        ...node,
                        lastReviewed: currentDate,
                        learningStatus: 'MASTERED'
                    };
                } else if (timeSpanInDays > 14) {
                    return {
                        ...node,
                        lastReviewed: currentDate,
                        learningStatus: 'MATURE'
                    };
                } else {
                    return {
                        ...node,
                        lastReviewed: currentDate,
                        learningStatus: 'LEARNING'
                    };
                }
            }
        });
    };

    const handleNewStats = async (newCardsReviewedArr, farcasterId, publicKey) => {
        const pinataResponse = await fetchPinata('https://api.pinata.cloud/pinning/pinJSONToIPFS', 'POST', {
            pinataContent: newCardsReviewedArr,
            pinataMetadata: {
                name: `cardsReviewedFrom${publicKey ? publicKey : farcasterId}`
            }
        });

        const apiResponse = await fetchApi(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/idealiteStats`, 'POST', {
            farcasterId: farcasterId,
            publicKey: publicKey,
            cardsReviewed: pinataResponse.IpfsHash,
        });

        return apiResponse;
    };

    const handleExistingStats = async (newCardsReviewedArr, idealiteStats, farcasterId, publicKey) => {
        const existingCards = await fetch(`https://purple-defensive-anglerfish-674.mypinata.cloud/ipfs/${idealiteStats.edges[0].node.cardsReviewed}`).then(res => res.json());

        existingCards.forEach((card) => {
            const isDuplicate = newCardsReviewedArr.some((newCard) => newCard.id === card.id);
            if (!isDuplicate) {
                newCardsReviewedArr.push(card);
            }
        });

        const pinataResponse = await fetchPinata('https://api.pinata.cloud/pinning/pinJSONToIPFS', 'POST', {
            pinataContent: newCardsReviewedArr,
            pinataMetadata: {
                name: `cardsReviewedFrom${publicKey ? publicKey : farcasterId}`
            }
        });

        if (pinataResponse.IpfsHash) {
            try {
                await unpinFromPinata(idealiteStats.edges[0].node.cardsReviewed);
            } catch (error) {
                console.log('Error: ' + error.message);
            }
        }

        const apiResponse = await fetchApi(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/idealiteStats`, 'PATCH', {
            idealiteStatsId: idealiteStats.edges[0]?.node.id,
            farcasterId: farcasterId,
            publicKey: publicKey,
            cardsReviewed: pinataResponse.IpfsHash,
        });

        return apiResponse;
    };

    const processIdealiteStatsAndCards = async (composeClient, query, variableValues, cardsLearned, farcasterId, publicKey) => {
        try {
            const idealiteStatsData = await composeClient.executeQuery(query, variableValues);
            const nodesArr = idealiteStatsData?.data?.nodes;

            const newCardsReviewedArr = updateCardsReviewed(nodesArr, cardsLearned);
            const idealiteStats = idealiteStatsData.data.idealiteStatsv1Index;

            if (idealiteStats.edges.length === 0) {
                const response = await handleNewStats(newCardsReviewedArr, farcasterId, publicKey);
                return res.status(200).json({ response });
            } else {
                const response = await handleExistingStats(newCardsReviewedArr, idealiteStats, farcasterId, publicKey);
                return res.status(200).json({ response });
            }
        } catch (error) {
            console.error(error.message);
            return res.status(500).send({ message: error.message });
        }
    };

    switch (req.method) {
        case 'POST':

            let filter = {}
            let cardIdArr = []

            if (farcasterId) {
                filter.farcasterId = { equalTo: farcasterId };
            } else {
                filter.publicKey = { equalTo: publicKey };
            }

            cardsLearned.map((card) => {
                cardIdArr.push(card.cardId)
            })

            let variableValues = {
                "ids": cardIdArr,
                where: filter
            }

            processIdealiteStatsAndCards(
                composeClient,
                `
                query queryIdealiteStatsAndCards($ids: [ID!] = "", $where: IdealiteStatsv1ObjectFilterInput = {}) {
                    nodes(ids: $ids) {
                    ... on IdealiteCardv1 {
                        id
                        resourceId
                        account {
                        id
                        }
                        annotation
                        cid
                        lastReviewed
                        learningStatus
                        timesForgotten
                        url
                    }
                    }
                    idealiteStatsv1Index(first: 10, filters: {where: $where}) {
                    edges {
                        node {
                        id
                        cardsReviewed
                        }
                    }
                    }
                }
                `,
                variableValues,
                cardsLearned,
                farcasterId,
                publicKey
            );
            break;
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${req.method} is not allowed.`)
    }
}

export default handler 