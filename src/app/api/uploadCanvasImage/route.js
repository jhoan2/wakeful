import { Web3Storage } from 'web3.storage';
const client = new Web3Storage({ token: process.env.WEB_3_STORAGE_TOKEN });

export async function POST(request) {
    const data = await request.formData()
    const file = data.get('canvasFile')

    if (!file || typeof file !== 'object') {
        console.log('No file provided or file input is not of type file.');
        return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
        console.log('The provided file is not an image.');
        return new Response(JSON.stringify({ error: 'The provided file is not an image' }), { status: 400 });
    }

    const rootCid = await client.put([file])
    return Response.json({ rootCid: rootCid })
}