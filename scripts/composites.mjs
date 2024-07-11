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

  const idealiteResourcev2Composite = await createComposite(
    ceramic,
    "./composites/IdealiteResourcev2.graphql"
  );

  const idealiteProfilev1Composite = await createComposite(
    ceramic,
    "./composites/IdealiteProfilev1.graphql"
  );

  const idealiteCardv1Schema = readFileSync("./composites/IdealiteCardv1.graphql", {
    encoding: "utf-8",
  }).replace("$IDEALITE_RESOURCE_ID", idealiteResourcev2Composite.modelIDs[0]);

  const idealiteCardv1Composite = await Composite.create({
    ceramic,
    schema: idealiteCardv1Schema,
  });

  const idealiteAccountResourcesv1Schema = readFileSync("./composites/IdealiteAccountResourcesv1.graphql", {
    encoding: "utf-8",
  }).replace("$IDEALITE_RESOURCE_ID", idealiteResourcev2Composite.modelIDs[0]);

  const idealiteAccountResourcesv1Composite = await Composite.create({
    ceramic,
    schema: idealiteAccountResourcesv1Schema,
  });

  const resourcesCardsSchema = readFileSync(
    "./composites/ResourcesCards.graphql",
    {
      encoding: "utf-8",
    }
  )
    .replace("$IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])
    .replace("$IDEALITE_RESOURCE_ID", idealiteResourcev2Composite.modelIDs[0]);

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
    .replace("$IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])
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
    .replace("$IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])
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
    .replace("$IDEALITE_PROJECT_ID", idealiteCardv1Composite.modelIDs[1])
    .replace("$IDEALITE_PROJECT_CARD_COLLECTION_ID", idealiteProjectCardCollectionComposite.modelIDs[2]);

  const projectsCardsComposite = await Composite.create({
    ceramic,
    schema: projectsCardsSchema,
  });

  const idealiteTagv1Composite = await createComposite(
    ceramic,
    "./composites/IdealiteTagv1.graphql"
  );

  const idealiteStatsComposite = await createComposite(
    ceramic,
    "./composites/IdealiteStatsv1.graphql"
  );

  const idealiteTagAccountResourceCollectionv1Schema = readFileSync(
    "./composites/IdealiteTagAccountResourceCollectionv1.graphql",
    {
      encoding: "utf-8",
    }
  )
    .replace("$IDEALITE_TAG_ID", idealiteTagv1Composite.modelIDs[0])
    .replace("$IDEALITE_ACCOUNT_RESOURCE_ID", idealiteAccountResourcesv1Composite.modelIDs[1])


  const idealiteTagAccountResourceCollectionv1Composite = await Composite.create({
    ceramic,
    schema: idealiteTagAccountResourceCollectionv1Schema,
  })


  const accountResourcesTagsSchema = readFileSync(
    './composites/AccountResourcesTags.graphql',
    {
      encoding: 'utf-8'
    },
  )
    .replace("$IDEALITE_ACCOUNT_RESOURCE_ID", idealiteAccountResourcesv1Composite.modelIDs[1])
    .replace("$IDEALITE_TAG_ACCOUNT_RESOURCE_COLLECTION_ID", idealiteTagAccountResourceCollectionv1Composite.modelIDs[2])

  const accountResourcesTagsComposite = await Composite.create({
    ceramic,
    schema: accountResourcesTagsSchema
  })

  const tagsAccountResourcesSchema = readFileSync(
    "./composites/TagsAccountResources.graphql",
    {
      encoding: "utf-8",
    },
  )
    .replace("$IDEALITE_TAG_ID", idealiteTagv1Composite.modelIDs[0])
    .replace("$IDEALITE_TAG_ACCOUNT_RESOURCE_COLLECTION_ID", idealiteTagAccountResourceCollectionv1Composite.modelIDs[2])

  const tagsAccountResourceComposite = await Composite.create({
    ceramic,
    schema: tagsAccountResourcesSchema
  })

  const idealiteTagCardCollectionv1Schema = readFileSync(
    "./composites/IdealiteTagCardCollectionv1.graphql",
    {
      encoding: "utf-8",
    }
  )
    .replace("$IDEALITE_TAG_ID", idealiteTagv1Composite.modelIDs[0])
    .replace("$IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])


  const idealiteTagCardCollectionv1Composite = await Composite.create({
    ceramic,
    schema: idealiteTagCardCollectionv1Schema,
  })



  const tagsCardsSchema = readFileSync(
    "./composites/TagsCard.graphql",
    {
      encoding: 'utf-8'
    },
  )
    .replace("$IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])
    .replace("$IDEALITE_TAG_CARD_COLLECTION_ID", idealiteTagCardCollectionv1Composite.modelIDs[2])

  const tagCardsComposite = await Composite.create({
    ceramic,
    schema: tagsCardsSchema
  })

  const cardsTagsSchema = readFileSync(
    "./composites/CardsTag.graphql",
    {
      encoding: "utf-8",
    },
  )
    .replace("$IDEALITE_TAG_ID", idealiteTagv1Composite.modelIDs[0])
    .replace("$IDEALITE_TAG_CARD_COLLECTION_ID", idealiteTagCardCollectionv1Composite.modelIDs[2])


  const cardsTagsComposite = await Composite.create({
    ceramic,
    schema: cardsTagsSchema
  })

  console.log('idealiteresourcev2composite', idealiteResourcev2Composite.modelIDs)
  console.log('idealiteproject', idealiteProjectComposite.modelIDs)
  console.log('idealiteCardv1composite', idealiteCardv1Composite.modelIDs)
  console.log('idealiteprojectcardcollectioncomposite', idealiteProjectCardCollectionComposite.modelIDs)
  console.log('idealiteTagv1', idealiteTagv1Composite.modelIDs)
  console.log('idealiteTagCardCollectionv1', idealiteTagCardCollectionv1Composite.modelIDs)
  console.log('idealiteAccountResourcesv1', idealiteAccountResourcesv1Composite.modelIDs)
  console.log('idealitetagAccountResourceCollectionv1Composite', idealiteTagAccountResourceCollectionv1Composite.modelIDs)

  const composite = Composite.from([
    idealiteResourcev2Composite,
    idealiteProfilev1Composite,
    idealiteCardv1Composite,
    idealiteAccountResourcesv1Composite,
    resourcesCardsComposite,
    idealiteProjectComposite,
    idealiteProjectCardCollectionComposite,
    cardsProjectsComposite,
    projectsCardsComposite,
    idealiteTagv1Composite,
    idealiteStatsComposite,
    idealiteTagAccountResourceCollectionv1Composite,
    accountResourcesTagsComposite,
    tagsAccountResourceComposite,
    idealiteTagCardCollectionv1Composite,
    tagCardsComposite,
    cardsTagsComposite
  ]);

  const newComposite = composite.setAliases({
    [`${idealiteResourcev2Composite.modelIDs[0]}`]: 'IdealiteResourcev2',
    [`${idealiteCardv1Composite.modelIDs[1]}`]: 'IdealiteCardv1',
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