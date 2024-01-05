import { ComposeClient } from '@composedb/client';
import { CeramicClient } from '@ceramicnetwork/http-client'
import { definition } from '../../src/__generated__/definition';
import { fromString } from 'uint8arrays/from-string'
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";

const handler = async (req, res) => {
    const ceramic = new CeramicClient('https://ceramic-idealite-mainnet.hirenodes.io/')

    //instantiate a composeDB client instance
    const composeClient = new ComposeClient({
        ceramic: 'https://ceramic-idealite-mainnet.hirenodes.io/',
        definition: definition
    });
    const { data } = req.body
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
    let variableValues = {
        "i": {
            "id": data.id,
            "content": data
        }
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
        case 'PATCH':
            delete variableValues.i.content.id
            variableValues.i.content.updatedAt = new Date().toISOString()
            composeClient.executeQuery(`
                mutation MyMutation ($i: UpdateIdealiteResourceInput!){
                    updateIdealiteResource(input: $i) {
                      document {
                        id
                      }
                    }
                  }
              `, variableValues)
                .then(updateIdealiteResource => {
                    return res.status(200).json({ updatedResourceId: updateIdealiteResource.data.updateIdealiteResource.document.id })
                }).catch(error => {
                    return res.status(500).send({ message: error.message })
                })
            break;
        default:
            res.setHeader('Allow', ['PATCH'])
            res.status(405).end(`Method ${req.method} is not allowed.`)
    }
}

export default handler 