import { readFileSync, readdirSync } from 'fs';
import { CeramicClient } from '@ceramicnetwork/http-client'
import path, { extname } from 'path'
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
  mergeEncodedComposites
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

  const cardSchema = readFileSync("./composites/Card.graphql", {
    encoding: "utf-8",
  }).replace("$IDEALITE_RESOURCE_ID", idealiteResourceComposite.modelIDs[0]);

  const cardComposite = await Composite.create({
    ceramic,
    schema: cardSchema,
  });

  const accountResourcesSchema = readFileSync("./composites/AccountResources.graphql", {
    encoding: "utf-8",
  }).replace("$IDEALITE_RESOURCE_ID", idealiteResourceComposite.modelIDs[0]);

  const accountResourcesComposite = await Composite.create({
    ceramic,
    schema: accountResourcesSchema,
  });

  const resourcesCardsSchema = readFileSync(
    "./composites/ResourcesCards.graphql",
    {
      encoding: "utf-8",
    }
  )
    .replace("$CARD_ID", cardComposite.modelIDs[1])
    .replace("$IDEALITE_RESOURCE_ID", idealiteResourceComposite.modelIDs[0]);

  const resourcesCardsComposite = await Composite.create({
    ceramic,
    schema: resourcesCardsSchema,
  });

  const composite = Composite.from([
    idealiteResourceComposite,
    cardComposite,
    accountResourcesComposite,
    resourcesCardsComposite,
  ]);

  await writeEncodedComposite(composite, "./src/__generated__/definition.json");
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