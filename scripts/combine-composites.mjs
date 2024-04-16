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

    const loadSources = [
        './src/__generated__/definition0.json',
        './src/__generated__/olddefinition.json',
    ].map(async (path) => await readEncodedComposite(ceramic, path))
    const sourceComposites = await Promise.all(loadSources)
    const mergedComposite = Composite.from(sourceComposites)

    await writeEncodedComposite(mergedComposite, "./src/__generated__/definition.json");
    spinner.info("creating composite for runtime usage");
    await writeEncodedCompositeRuntime(
        ceramic,
        "./src/__generated__/definition.json",
        "./src/__generated__/definition.js"
    );
    spinner.info("deploying composite");
    const deployComposite = await readEncodedComposite(
        ceramic,
        "./src/__generated__/definition.json",
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
