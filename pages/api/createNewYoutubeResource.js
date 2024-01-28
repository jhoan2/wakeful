import { ComposeClient } from '@composedb/client';
import { CeramicClient } from '@ceramicnetwork/http-client'
import { definition } from '../../src/__generated__/definition';
import { fromString } from 'uint8arrays/from-string'
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";

const handler = async (req, res) => {
  const ceramic = new CeramicClient(`${process.env.NEXT_PUBLIC_CERAMIC_API_URL}`)

  //instantiate a composeDB client instance
  const composeClient = new ComposeClient({
    ceramic: `${process.env.NEXT_PUBLIC_CERAMIC_API_URL}`,
    definition: definition
  });
  const { clientMutationId, url, title, createdAt, updatedAt, cid } = req.body
  const uniqueKey = process.env.ADMIN_DID_KEY;
  let input = {
    url: url,
    title: title,
    createdAt: createdAt,
    updatedAt: updatedAt,
    cid: cid,
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
              mutation CreateNewResource ($i: CreateIdealiteResourceInput!) {
                createIdealiteResource(
                  input: $i
                ) {
                  document {
                    id
                  }
                }
              }
            `, variableValues)
        .then(newResourceObj => {
          connectResourceAccountValues.i.content.resourceId = newResourceObj.data.createIdealiteResource.document.id
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
      break;
    default:
      res.setHeader('Allow', ['GET, POST'])
      res.status(405).end(`Method ${req.method} is not allowed.`)
  }
}

export default handler 