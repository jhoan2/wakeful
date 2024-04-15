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
            'kjzl6hvfrbw6c8v2iz3ltlhdvuq51oclivpajlckgoqtk9etgy4pwh7r030zro7',
            'kjzl6hvfrbw6cb8l1tjfdrni85hgfpevfxi7ceh2thlvslxgy2m60uhkjh18s2o',
            'kjzl6hvfrbw6carxwhe5mdw4k3r1qrlv5rrrs90ul8psqtlnjxvrqnk0x3oj47k',
            'kjzl6hvfrbw6c8h6inzxxsgn89tqnqlkprlmgprbcg973eup41z6kij2gk80w3b',
            'kjzl6hvfrbw6c5nj2syxmc04de9fjmzp87y0kltg7npexpxovogbnhwhxaxabjk',
            'kjzl6hvfrbw6caqe3vlhkv1okijwfkar9c12k0qrb9bmin79bb4jsnb3efkxfqv',
            'kjzl6hvfrbw6c7agg6ef2d6nv0sdd9br9ghwz07a7yuzkxazrigg6yx3c6badtk',
            'kjzl6hvfrbw6c9v19k3dwpeett9gmjwpbt4dlj2qhka276ctjvzavczahhj7e5j',
            'kjzl6hvfrbw6c6arqydlgy0r51bumx0fmrsimmucittiuvy6olrd8oym1j6a8ba',
            'kjzl6hvfrbw6c6o0u5ui0wgpmgrcvdmtsrspqcc59hia4sqcpprayxt6guqwy6s',
            'kjzl6hvfrbw6c9sjnttvd5hbh3o2azb9kixrn34n8az0difoj0l9t4z5q16tpwy',
            'kjzl6hvfrbw6c8fzc49ryrppi1ibtsd0kbbu353lfjidr75griyjnah452upr92',
            'kjzl6hvfrbw6c7bmi72m2twm9x46dw9gikykqyyanigsyrtfx5sf3hynbb5zpxi'
        ]
    });

    const compositeWithAlises = compositeNoViews.setAliases({
        ['kjzl6hvfrbw6c8v2iz3ltlhdvuq51oclivpajlckgoqtk9etgy4pwh7r030zro7']: 'IdealiteResourcev0',
        ['kjzl6hvfrbw6cb8l1tjfdrni85hgfpevfxi7ceh2thlvslxgy2m60uhkjh18s2o']: 'IdealiteProfilev0',
        ['kjzl6hvfrbw6carxwhe5mdw4k3r1qrlv5rrrs90ul8psqtlnjxvrqnk0x3oj47k']: 'IdealiteCardsv0',
        ['kjzl6hvfrbw6c8h6inzxxsgn89tqnqlkprlmgprbcg973eup41z6kij2gk80w3b']: 'IdealiteAccountResourcesv0',
        ['kjzl6hvfrbw6c5nj2syxmc04de9fjmzp87y0kltg7npexpxovogbnhwhxaxabjk']: 'IdealiteProjectv0',
        ['kjzl6hvfrbw6caqe3vlhkv1okijwfkar9c12k0qrb9bmin79bb4jsnb3efkxfqv']: 'IdealiteProjectCardCollectionv0',
        ['kjzl6hvfrbw6c7agg6ef2d6nv0sdd9br9ghwz07a7yuzkxazrigg6yx3c6badtk']: 'IdealiteResourcev0.1',
        ['kjzl6hvfrbw6c9v19k3dwpeett9gmjwpbt4dlj2qhka276ctjvzavczahhj7e5j']: 'IdealiteProfilev0.1',
        ['kjzl6hvfrbw6c6arqydlgy0r51bumx0fmrsimmucittiuvy6olrd8oym1j6a8ba']: 'IdealiteCardsv0.1',
        ['kjzl6hvfrbw6c6o0u5ui0wgpmgrcvdmtsrspqcc59hia4sqcpprayxt6guqwy6s']: 'IdealiteAccountResourcesv0.1',
        ['kjzl6hvfrbw6c9sjnttvd5hbh3o2azb9kixrn34n8az0difoj0l9t4z5q16tpwy']: 'IdealiteProjectv0.1',
        ['kjzl6hvfrbw6c8fzc49ryrppi1ibtsd0kbbu353lfjidr75griyjnah452upr92']: 'IdealiteProjectCardCollectionv0.1',
        ['kjzl6hvfrbw6c7bmi72m2twm9x46dw9gikykqyyanigsyrtfx5sf3hynbb5zpxi']: 'IdealiteTagv0.1'
    })

    const composite = compositeWithAlises.setViews({
        "account": {},
        "root": {},
        "models": {
            "kjzl6hvfrbw6c7agg6ef2d6nv0sdd9br9ghwz07a7yuzkxazrigg6yx3c6badtk": {
                "idealiteCards": {
                    "type": "relationFrom",
                    "model": "kjzl6hvfrbw6c6arqydlgy0r51bumx0fmrsimmucittiuvy6olrd8oym1j6a8ba",
                    "property": "resourceId"
                }
            },
            "kjzl6hvfrbw6c9v19k3dwpeett9gmjwpbt4dlj2qhka276ctjvzavczahhj7e5j": {},
            "kjzl6hvfrbw6c6arqydlgy0r51bumx0fmrsimmucittiuvy6olrd8oym1j6a8ba": {
                "collection": {
                    "type": "relationFrom",
                    "model": "kjzl6hvfrbw6c8fzc49ryrppi1ibtsd0kbbu353lfjidr75griyjnah452upr92",
                    "property": "projectId"
                }
            },
            "kjzl6hvfrbw6c6o0u5ui0wgpmgrcvdmtsrspqcc59hia4sqcpprayxt6guqwy6s": {},
            "kjzl6hvfrbw6c9sjnttvd5hbh3o2azb9kixrn34n8az0difoj0l9t4z5q16tpwy": {},
            "kjzl6hvfrbw6c8fzc49ryrppi1ibtsd0kbbu353lfjidr75griyjnah452upr92": {},
            "kjzl6hvfrbw6c7bmi72m2twm9x46dw9gikykqyyanigsyrtfx5sf3hynbb5zpxi": {}
        }
    });

    await writeEncodedComposite(composite, "./src/__generated__/definition2.json");
    spinner.info("creating composite for runtime usage");
    await writeEncodedCompositeRuntime(
        ceramic,
        "./src/__generated__/definition2.json",
        "./src/__generated__/definition2.js"
    );
    spinner.info("deploying composite");
    const deployComposite = await readEncodedComposite(
        ceramic,
        "./src/__generated__/definition2.json",
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
