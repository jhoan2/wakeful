import { ComposeClient } from '@composedb/client';
import { CeramicClient } from '@ceramicnetwork/http-client'
import { definition } from '../../src/__generated__/definition';
import { fromString } from 'uint8arrays/from-string'
import { Web3Storage } from 'web3.storage';
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";

const handler = async (req, res) => {
    const ceramic = new CeramicClient('http://localhost:7007')

    //instantiate a composeDB client instance
    const composeClient = new ComposeClient({
        ceramic: 'http://localhost:7007',
        definition: definition
    });
    const client = new Web3Storage({ token: process.env.WEB_3_STORAGE_TOKEN });
    const { imgUrl, clientMutationId, url, title, createdAt, updatedAt } = req.body
    const uniqueKey = process.env.ADMIN_DID_KEY;
    let input = {
        url: url,
        title: title,
        createdAt: createdAt,
        updatedAt: updatedAt,
        clientMutationId: clientMutationId
    }

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


    switch (req.method) {
        case 'GET':
            try {
                return res.status(200).json({ noteTree: 'success' })
            } catch (error) {
                return res.status(500).send(error)
            }
        case 'POST':
            if (imgUrl) {
                const response = await fetch(imgUrl)
                if (!response.ok) {
                    input.cid = 'https://w3s.link/ipfs/bafybeifq45vncec2g7awfflvipemzprv77g4lvgvvt46aeaeqepmqgey2i'
                }
                const blob = await response.blob();
                const file = new File([blob], `image.jpg`, { type: 'image/jpeg' });
                //this returns an object with the cid, need to destructure it out. 
                const fileCid = await client.put([file])
                input.cid = fileCid
            }

            let variableValues = {
                "i": {
                    "content": input
                }
            }
            let connectResourceAccountValues = {
                "i": {
                    "content": {
                        recipient: clientMutationId,
                        resourceId: null,
                        url: url,
                        createdAt: createdAt,
                        updatedAt: updatedAt
                    }
                }
            }
            composeClient.executeQuery(`
                    mutation CreateNewResource ($i: CreateIcarusResourceInput!) {
                      createIcarusResource(
                        input: $i
                      ) {
                        document {
                          id
                        }
                      }
                    }
                  `, variableValues)
                .then(newResourceObj => {
                    connectResourceAccountValues.i.content.resourceId = newResourceObj.data.createIcarusResource.document.id
                    return composeClient.executeQuery(`
                        mutation MyMutation ($i: CreateAccountResourcesInput!) {
                          createAccountResources(
                            input: $i
                          ) {
                            document {
                              id
                            }
                          }
                        }
                        `, connectResourceAccountValues)
                }).then(connectResourceToAccountResult => {
                    console.log('connectResourceToAccountResult', connectResourceToAccountResult.data.createAccountResources)
                    return res.status(200).json({ newResourceId: connectResourceAccountValues.i.content.resourceId })
                })
                .catch(error => {
                    return res.status(500).send({ message: error.message })
                })
        default:
            res.setHeader('Allow', ['GET, POST'])
            res.status(405).end(`Method ${req.method} is not allowed.`)
    }
}

export default handler 