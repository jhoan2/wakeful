import { Web3Storage } from 'web3.storage';
const client = new Web3Storage({ token: process.env.WEB_3_STORAGE_TOKEN });

export async function POST(req, res) {
    const { imgUrl } = await req.json()
    if (!imgUrl) {
        return new Response(JSON.stringify({ error: 'No Image Found' }), { status: 400 });
    }
    const response = await fetch(imgUrl)
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
    const blob = await response.blob();
    const file = new File([blob], `image.jpg`, { type: 'image/jpeg' });
    const rootCid = await client.put([file])
    return Response.json({ rootCid: rootCid })
}