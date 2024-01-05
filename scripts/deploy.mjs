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

    await encodeComposites(readdirSync('./composites'))
    await mergeComposites()

    spinner.succeed("composite deployed & ready for use");
}

const encodeComposites = async (files) => {
    let composite
    files.forEach(async (file, _id) => {
        try {
            composite = await createComposite(ceramic, `./composites/${file}`)
            await writeEncodedComposite(
                composite,
                `./src/__generated__/${file.split('.graphql')[0]}.json`
            )
            // const deployedComposite = await readEncodedComposite(ceramic, `./src/__generated__/${file.split('.graphql')[0]}.json`)
            // deployedComposite.startIndexingOn(ceramic)
        } catch (err) {
            console.error(err)
        }
    })
}

const mergeComposites = async () => {
    const files = readdirSync('./src/__generated__/').filter(file => { return extname(file).toLowerCase() === '.json' })
    setTimeout(async () => {
        await mergeEncodedComposites(
            ceramic,
            files.map(file => (`./src/__generated__/${file}`)),
            './src/__generated__/definition.json'
        )
        await writeEncodedCompositeRuntime(
            ceramic,
            './src/__generated__/definition.json',
            './src/__generated__/definition.js'
        )
        const deployedComposite = await readEncodedComposite(ceramic, './src/__generated__/definition.json')
        deployedComposite.startIndexingOn(ceramic)
    }, 3000)
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
