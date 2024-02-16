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

    const compositeNoViews = await Composite.fromModels({
        ceramic: ceramic,
        models: [
            'kjzl6hvfrbw6c7z68mmqpinqf4qbpw53mqixve4vorwqtls0ney1nyjlo40gy41',
            'kjzl6hvfrbw6c8he4pf834h1sxzepwy94921urziel3kzkz7cyw200h4rclzls6',
            'kjzl6hvfrbw6c7zzd6vap9c4787hhha1dy4dvqlgocv18rzir5agt00sifej502',
            'kjzl6hvfrbw6c75rjas273ew4g6lvr7569ynshcnk6q7zvwzodehjv7u40csmmq',
            'kjzl6hvfrbw6c5x0oqqj2684tgf1mxyvuprf9845wdi8zkdccjk308ind7rx9n5',
            'kjzl6hvfrbw6ca7vproo4zitweojj9kqukhpv2tz8ktet18dyz7a74zm4c7aaml'
        ]
    });

    const composite = compositeNoViews.setViews({
        "models": {
            "kjzl6hvfrbw6cb8n44ykipfxuj6qqwdik5s049wt0kmswirmrawcxw9ydywm0nq": {
                "cards": {
                    "type": "relationFrom",
                    "model": "kjzl6hvfrbw6c9zehj40sgq3i3r6b78pw63ue8mrj8gop2qztfi4c7dvntzpc5c",
                    "property": "resourceId"
                }
            },
            "kjzl6hvfrbw6c7kx70x0j9v78sqmbpqtjzalrxwytq4jww7ex9s87f7pctyhfqt": {},
            "kjzl6hvfrbw6c9zehj40sgq3i3r6b78pw63ue8mrj8gop2qztfi4c7dvntzpc5c": {
                "collection": {
                    "type": "relationFrom",
                    "model": "kjzl6hvfrbw6c98tpwkrfui3afsvgmdjqhhy2jqzup58jiok8kgp4sqdflsjj5y",
                    "property": "projectId"
                }
            },
            "kjzl6hvfrbw6c97wg1nnk5faqlu2xq9jc5txmp387u7jjoizaa5ls2yobapk9tt": {},
            "kjzl6hvfrbw6c6uteptv0tq574aplqowarja0zvmzdp6kyfzfaas9k5tfx63vpy": {},
            "kjzl6hvfrbw6c98tpwkrfui3afsvgmdjqhhy2jqzup58jiok8kgp4sqdflsjj5y": {}
        }
    });

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
