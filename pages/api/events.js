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

  const {
    title,
    clientMutationId,
    description,
    projectId,
    startTimestamp,
    endTimestamp,
    url,
    hostDisplayName,
    hostFarcasterId,
    hostAvatarCid,
    tags
  } = req.body.projectContent

  switch (req.method) {
    case 'POST':

      if (!clientMutationId) {
        return res.status(403).json({ message: 'Forbidden: clientMutationId is required' });
      }

      let projectContent = {
        title: title.toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientMutationId: clientMutationId || null,
        description: description || null,
        startTimestamp: startTimestamp || null,
        endTimestamp: endTimestamp || null,
        eventChildId: projectId,
        isPublic: true,
        url: url || null,
        hostDisplayName: hostDisplayName || null,
        hostFarcasterId: hostFarcasterId || null,
        hostAvatarCid: hostAvatarCid || null,
        projectParentId: projectId || null,
        deleted: false
      }

      for (const key in projectContent) {
        if (projectContent[key] === undefined || projectContent[key] === null || projectContent[key] === "") {
          delete projectContent[key];
        }
      }

      let variableValues = {
        "input": {
          "content": projectContent
        }
      }

      try {
        const newEventId = await composeClient.executeQuery(`
          mutation CREATE_IDEALITE_PROJECT($input: CreateIdealiteProjectv1Input!) {
              createIdealiteProjectv1(input: $input) {
                  document {
                      id
                  }
              }
          }
        `, variableValues)

        // Map through the tags and create idealiteprojecttag collections
        //tags have been cleaned up to be an array of just the tagIds. 
        if (tags && tags.length > 0) {
          const createTagPromises = tags.map(async (tagId) => {
            const tagVariables = {
              "input": {
                "content": {
                  deleted: false,
                  idealiteProjectId: newEventId.data.createIdealiteProjectv1.document.id,
                  idealiteTagId: tagId
                }
              }
            };

            try {
              await composeClient.executeQuery(`
                mutation addTagToProject($input: CreateIdealiteTagProjectCollectionv1Input!) {
                  createIdealiteTagProjectCollectionv1(input: $input) {
                      document {
                          id
                      }
                  }
                }
              `, tagVariables);
            } catch (error) {
              console.error(`Error creating tag association: ${error.message}`);
              // Consider how you want to handle individual tag creation errors
            }
          });

          await Promise.allSettled(createTagPromises);
        }

        res.status(200).json({ newEventId: newEventId })
      } catch (error) {
        console.log(error.message)
        return res.status(500).send({ message: error.message })
      }
      break;

    case 'PATCH':
      try {

        if (!projectId) {
          return res.status(400).json({ message: 'Project ID is required' });
        }

        let updatedContent = {
          title: title.toLowerCase(),
          updatedAt: new Date().toISOString(),
          clientMutationId: clientMutationId || null,
          description: description || null,
          startTimestamp: startTimestamp || null,
          endTimestamp: endTimestamp || null,
          url: url || null,
        }

        for (const key in updatedContent) {
          if (updatedContent[key] === undefined || updatedContent[key] === null || updatedContent[key] === "") {
            delete updatedContent[key];
          }
        }

        let updateProjectVariables = {
          input: {
            id: projectId,
            content: updatedContent
          }
        };

        const updatedEventId = await composeClient.executeQuery(`
          mutation updateIdealiteProject($input: UpdateIdealiteProjectv1Input = {id: "", content: {}}) {
            updateIdealiteProjectv1(input: $input) {
              document {
                id
              }
            }
          }
        `, updateProjectVariables)

        if (!updatedEventId.data.updateIdealiteProjectv1) {
          throw new Error('Failed to update event');
        }

        res.status(200).json({
          message: 'Event updated successfully',
          updatedEventId: updatedEventId.data.updateIdealiteProjectv1.document.id
        });
      } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error deleting event', error: error.message });
      }
      break;

    case 'DELETE':
      if (!req.body.eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
      }
      try {
        const eventId = req.body.eventId;

        const deleteEventResult = await composeClient.executeQuery(`
          mutation deleteEvent($id: ID = "") {
            updateIdealiteProjectv1(
              input: {id: $id, content: {isPublic: false, deleted: true}}
            ) {
              document {
                id
              }
            }
          }
        `, { id: eventId });

        if (!deleteEventResult.data.updateIdealiteProjectv1) {
          return res.status(404).json({ message: 'Event not found or already deleted' });
        }

        res.status(200).json({
          message: 'Event and associated tags deleted successfully',
          deletedEventId: eventId,
        });
      } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['POST', 'PATCH', 'DELETE'])
      res.status(405).end(`Method ${req.method} is not allowed.`)
  }
}

export default handler 