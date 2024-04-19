import { readFileSync } from 'fs';
import { CeramicClient } from '@ceramicnetwork/http-client'
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
} from "@composedb/devtools-node";
import { Composite } from "@composedb/devtools";
import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";


const ceramic = new CeramicClient("http://localhost:7007");

/**
 * @param {Ora} spinner - to provide progress status.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposite = async (spinner) => {
  await authenticate()
  spinner.info("writing composite to Ceramic")

  const idealiteResourceComposite = await createComposite(
    ceramic,
    "./composites/IdealiteResource.graphql"
  );

  const idealiteProfileComposite = await createComposite(
    ceramic,
    "./composites/IdealiteProfile.graphql"
  );

  const idealiteCardSchema = readFileSync("./composites/IdealiteCard.graphql", {
    encoding: "utf-8",
  }).replace("$IDEALITE_RESOURCE_ID", idealiteResourceComposite.modelIDs[0]);

  const idealiteCardComposite = await Composite.create({
    ceramic,
    schema: idealiteCardSchema,
  });

  const idealiteAccountResourcesSchema = readFileSync("./composites/IdealiteAccountResources.graphql", {
    encoding: "utf-8",
  }).replace("$IDEALITE_RESOURCE_ID", idealiteResourceComposite.modelIDs[0]);

  const idealiteAccountResourcesComposite = await Composite.create({
    ceramic,
    schema: idealiteAccountResourcesSchema,
  });

  const resourcesCardsSchema = readFileSync(
    "./composites/ResourcesCards.graphql",
    {
      encoding: "utf-8",
    }
  )
    .replace("$IDEALITE_CARD_ID", idealiteCardComposite.modelIDs[1])
    .replace("$IDEALITE_RESOURCE_ID", idealiteResourceComposite.modelIDs[0]);

  const resourcesCardsComposite = await Composite.create({
    ceramic,
    schema: resourcesCardsSchema,
  });

  const idealiteProjectComposite = await createComposite(
    ceramic,
    "./composites/IdealiteProject.graphql"
  );


  const idealiteProjectCardCollectionSchema = readFileSync(
    "./composites/IdealiteProjectCardCollection.graphql",
    {
      encoding: "utf-8",
    }
  )
    .replace("$IDEALITE_CARD_ID", idealiteCardComposite.modelIDs[1])
    .replace("$IDEALITE_PROJECT_ID", idealiteProjectComposite.modelIDs[0]);

  const idealiteProjectCardCollectionComposite = await Composite.create({
    ceramic,
    schema: idealiteProjectCardCollectionSchema,
  });

  const cardsProjectsScehma = readFileSync(
    "./composites/CardsProjects.graphql",
    {
      encoding: "utf-8",
    }
  )
    .replace("$IDEALITE_CARD_ID", idealiteCardComposite.modelIDs[1])
    .replace("$IDEALITE_PROJECT_CARD_COLLECTION_ID", idealiteProjectCardCollectionComposite.modelIDs[2]);

  const cardsProjectsComposite = await Composite.create({
    ceramic,
    schema: cardsProjectsScehma,
  });

  const projectsCardsSchema = readFileSync(
    "./composites/ProjectsCards.graphql",
    {
      encoding: "utf-8",
    }
  )
    .replace("$IDEALITE_PROJECT_ID", idealiteCardComposite.modelIDs[1])
    .replace("$IDEALITE_PROJECT_CARD_COLLECTION_ID", idealiteProjectCardCollectionComposite.modelIDs[2]);

  console.log('idealiteresourcecomposite', idealiteResourceComposite.modelIDs)
  console.log('idealiteproject', idealiteProjectComposite.modelIDs)
  console.log('idealiteCardcomposite', idealiteCardComposite.modelIDs)
  console.log('idealiteprojectcardcollectioncomposite', idealiteProjectCardCollectionComposite.modelIDs)

  const projectsCardsComposite = await Composite.create({
    ceramic,
    schema: projectsCardsSchema,
  });

  const idealiteTagComposite = await createComposite(
    ceramic,
    "./composites/IdealiteTag.graphql"
  );

  const composite = Composite.from([
    idealiteResourceComposite,
    idealiteProfileComposite,
    idealiteCardComposite,
    idealiteAccountResourcesComposite,
    resourcesCardsComposite,
    idealiteProjectComposite,
    idealiteProjectCardCollectionComposite,
    cardsProjectsComposite,
    projectsCardsComposite,
    idealiteTagComposite
  ]);

  const newComposite = composite.setAliases({
    [`${idealiteResourceComposite.modelIDs[0]}`]: 'IdealiteResource',
    [`${idealiteCardComposite.modelIDs[1]}`]: 'IdealiteCards',
    [`${idealiteProjectComposite.modelIDs[0]}`]: 'IdealiteProject',
    [`${idealiteProjectCardCollectionComposite.modelIDs[2]}`]: 'IdealiteProjectCardCollection'
  })

  await writeEncodedComposite(newComposite, "./src/__generated__/definition.json");
  spinner.info("creating composite for runtime usage");
  await writeEncodedCompositeRuntime(
    ceramic,
    "./src/__generated__/definition.json",
    "./src/__generated__/definition.js"
  );
  spinner.info("deploying composite");
  const deployComposite = await readEncodedComposite(
    ceramic,
    "./src/__generated__/definition.json"
  );


  await deployComposite.startIndexingOn(ceramic);

  spinner.succeed("composite deployed & ready for use");
}


/**
 * Authenticating DID for publishing composite
 * @return {Promise<void>} - return void when DID is authenticated.
 */
const authenticate = async () => {
  const seed = readFileSync('./admin_seed.txt')
  const key = fromString(
    seed,
    "base16"
  );
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key)
  })
  await did.authenticate()
  ceramic.did = did
}