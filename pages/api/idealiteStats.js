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
        actionsOverTime,
        cardsMasteredOverTime,
        cardsReviewed,
        cardsReviewedSaved,
        farcasterId,
        idealiteProfileId,
        publicKey,
        idealiteStatsId,
        numCardsLearning,
        numCardsMastered,
        numCardsMature,
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

    let input = {
        actionsOverTime: actionsOverTime,
        cardsMasteredOverTime: cardsMasteredOverTime,
        cardsReviewed: cardsReviewed,
        cardsReviewedSaved: cardsReviewedSaved,
        farcasterId: farcasterId ? farcasterId.toString() : null,
        idealiteProfileId: idealiteProfileId,
        publicKey: publicKey,
        updatedAt: new Date().toISOString(),
        numCardsLearning: numCardsLearning,
        numCardsMature: numCardsMature,
        numCardsMastered: numCardsMastered
    }

    for (const key in input) {
        if (input[key] === undefined || input[key] === null || input[key] === "") {
            delete input[key];
        }
    }
    switch (req.method) {
        case 'POST':

            let variableValues = {
                "input": {
                    "content": input
                }
            }

            composeClient.executeQuery(`
                mutation createNewIdealiteStats ($input: SetIdealiteStatsv1Input = {content: {}}) {
                    setIdealiteStatsv1(input: $input) {
                    document {
                        id
                    }
                    }
                }
                  `, variableValues)
                .then(newIdealiteStatsId => {
                    return res.status(200).json({ newIdealiteStatsId: newIdealiteStatsId.data.setIdealiteStatsv1.document.id })
                })
                .catch(error => {
                    console.log(error.message)
                    return res.status(500).send({ message: error.message })
                })
            break;
        case 'PATCH':
            let updateVariables = {
                "input": {
                    "id": idealiteStatsId,
                    "content": input
                }
            }
            composeClient.executeQuery(`
                mutation MyMutation($input: UpdateIdealiteStatsv1Input = {id: "", content: {}}) {
                    updateIdealiteStatsv1(input: $input) {
                        document {
                            id
                        }
                    }
                }
                  `, updateVariables)
                .then(updatedIdealiteStats => {
                    return res.status(200).json({ updatedIdealiteStats: updatedIdealiteStats.data.updateIdealiteStatsv1 })
                })
                .catch(error => {
                    console.log(error.message)
                    return res.status(500).send({ message: error.message })
                })
            break;
        default:
            res.setHeader('Allow', ['POST', 'PATCH'])
            res.status(405).end(`Method ${req.method} is not allowed.`)
    }
}

export default handler 