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
        clientMutationId,
        url,
        title,
        createdAt,
        updatedAt,
        author,
        description,
        cid,
        mediaType,
        deleted
    } = req.body

    const uniqueKey = process.env.ADMIN_DID_KEY;
    let input = {
        url: url,
        title: title,
        createdAt: createdAt,
        updatedAt: updatedAt,
        clientMutationId: clientMutationId,
        author: author || 'n/a',
        description: description,
        cid: cid,
        mediaType: mediaType,
        deleted: deleted || false
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

            let variableValues = {
                "i": {
                    "content": input
                }
            }

            composeClient.executeQuery(`
                    mutation CreateNewResource ($i: CreateIdealiteResourcev2Input!) {
                      createIdealiteResourcev2(
                        input: $i
                      ) {
                        document {
                          id
                        }
                      }
                    }
                  `, variableValues)
                .then(newResourceObj => {
                    return res.status(200).json({ newResourceId: newResourceObj.data.createIdealiteResourcev2.document.id })
                })
                .catch(error => {
                    return res.status(500).send({ message: error.message })
                })
            break;
        default:
            res.setHeader('Allow', ['GET, POST'])
            res.status(405).end(`Method ${req.method} is not allowed.`)
    }
}

export default handler 