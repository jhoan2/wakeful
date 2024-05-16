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
  const { title, clientMutationId, description, publishedAt, author, cid, openLibraryKey } = req.body
  const uniqueKey = process.env.ADMIN_DID_KEY;
  let input = {
    title: title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clientMutationId: clientMutationId,
    description: description,
    publishedAt: publishedAt,
    author: author || 'n/a',
    cid: cid,
    mediaType: 'Book',
    openLibraryKey: openLibraryKey
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
    case 'POST':
      let resourceId;
      let variableValues = {
        "i": {
          "content": input
        }
      }

      try {
        //Search if the resource exists
        const existingResourceId = await composeClient.executeQuery(`
                query getResourceId {
                    idealiteResourceIndex(
                      filters: {where: {title: {equalTo: "${title}"}, author: {equalTo: "${author}"}}}
                      first: 2
                    ) {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                  }
                  `)

        //If the resource doesn't exist create one and set resourceId to it
        if (existingResourceId && existingResourceId.data.idealiteResourceIndex.edges.length === 0) {
          const newResourceId = await composeClient.executeQuery(`
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
          console.log(newResourceId)
          resourceId = newResourceId.data.createIdealiteResource.document.id
        } else {
          //if it does exist, set the resourceId to it 
          resourceId = existingResourceId.data.idealiteResourceIndex.edges[0].node.id

        }
        //Return a resourceId to be used on chrome extension to add notes 
        res.status(200).json({ newResourceId: resourceId })
      } catch (error) {
        console.log(error.message)
        return res.status(500).send({ message: error.message })
      }
      break;
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} is not allowed.`)
  }
}

export default handler 