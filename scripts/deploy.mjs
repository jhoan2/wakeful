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
import ora from 'ora'


const spinner = ora();
const ceramic = new CeramicClient("https://ceramic-idealite-mainnet.hirenodes.io/");

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

    const idealiteProjectv1Composite = await createComposite(
        ceramic,
        "./composites/IdealiteProjectv1.graphql"
    );


    const idealiteProjectCardCollectionSchema = readFileSync(
        "./composites/IdealiteProjectCardCollectionv1.graphql",
        {
            encoding: "utf-8",
        }
    )
        .replace("$IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])
        .replace("$IDEALITE_PROJECT_ID", idealiteProjectv1Composite.modelIDs[0]);

    const idealiteProjectCardCollectionv1Composite = await Composite.create({
        ceramic,
        schema: idealiteProjectCardCollectionv1Schema,
    });

    const cardsProjectsScehma = readFileSync(
        "./composites/CardsProjects.graphql",
        {
            encoding: "utf-8",
        }
    )
        .replace("$IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])
        .replace("$IDEALITE_PROJECT_CARD_COLLECTION_ID", idealiteProjectCardCollectionv1Composite.modelIDs[2]);

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
        .replace("IDEALITE_TAG_ID", idealiteTagv1Composite.modelIDs[1])
        .replace("IDEALITE_ACCOUNT_RESOURCE_ID", idealiteAccountResourcesv1Composite.modelIDs[0])


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
        .replace("IDEALITE_ACCOUNT_RESOURCE_ID", idealiteAccountResourcesv1Composite.modelIDs[1])
        .replace("IDEALITE_TAG_ACCOUNT_RESOURCE_COLLECTION_ID", idealiteTagAccountResourceCollectionv1Composite.modelIDs[2])

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
        .replace("IDEALITE_TAG_ID", idealiteTagv1Composite.modelIDs[1])
        .replace("IDEALITE_TAG_ACCOUNT_RESOURCE_COLLECTION_ID", idealiteTagAccountResourceCollectionv1Composite.modelIDs[2])

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
        .replace("IDEALITE_TAG_ID", idealiteTagv1Composite.modelIDs[1])
        .replace("IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[0])


    const idealiteTagCardCollectionv1Composite = await Composite.create({
        ceramic,
        schema: idealiteTagCardCollectionv1Schema,
    })

    const tagsCardsSchema = readFileSync(
        {
            encoding: 'utf-8'
        },
    )
        .replace("IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])
        .replace("IDEALITE_TAG_CARD_COLLECTION_ID", idealiteTagCardCollectionv1Composite.modelIDs[2])

    const tagCardsComposite = await Composite.create({
        ceramic,
        schema: tagsCardsSchema
    })

    const cardsTagsSchema = readFileSync(
        "./composites/CardsTags.graphql",
        {
            encoding: "utf-8",
        },
    )
        .replace("IDEALITE_CARD_ID", idealiteCardv1Composite.modelIDs[1])
        .replace("IDEALITE_TAG_CARD_COLLECTION_ID", idealiteTagCardCollectionv1Composite.modelIDs[2])


    const cardsTagsComposite = await Composite.create({
        ceramic,
        schema: cardsTagsSchema
    })



    const composite = Composite.from([
        idealiteResourcev2Composite,
        idealiteProfilev1Composite,
        idealiteCardv1Composite,
        idealiteAccountResourcesv1Composite,
        resourcesCardsComposite,
        idealiteProjectv1Composite,
        idealiteProjectCardCollectionv1Composite,
        cardsProjectsComposite,
        projectsCardsComposite,
        idealiteTagv1Composite,
        idealiteStatsComposite,
        accountResourcesTagsComposite,
        tagsAccountResourceComposite,
        idealiteTagCardCollectionv1Composite,
        tagCardsComposite,
        cardsTagsComposite
    ]);

    const newComposite = composite.setAliases({
        [`${idealiteResourcev2Composite.modelIDs[0]}`]: 'IdealiteResourcev2',
        [`${idealiteCardv1Composite.modelIDs[1]}`]: 'IdealiteCardv1',
        [`${idealiteProjectv1Composite.modelIDs[0]}`]: 'IdealiteProjectv1',
        [`${idealiteProjectCardCollectionv1Composite.modelIDs[2]}`]: 'IdealiteProjectCardCollectionv1'
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
    const seed = process.env.HIRENODES_ADMIN_SEED
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

const bootstrap = async () => {
    // TODO: convert to event driven to ensure functions run in correct orders after releasing the bytestream.
    // TODO: check if .grapql files match their .json counterparts
    //       & do not create the model if it already exists & has not been updated
    try {
        spinner.info("[Composites] bootstrapping composites");
        await writeComposite(spinner)
        spinner.succeed("Composites] composites bootstrapped");
    } catch (err) {
        spinner.fail(err.message)
        throw err
    }
}

bootstrap()
