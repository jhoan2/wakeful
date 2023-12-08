import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const data = await request.formData()
        const file = data.get('file');
        data.append('pinataMetadata', JSON.stringify({ name: uuidv4() }))

        if (!file || typeof file !== 'object') {
            console.log('No file provided or file input is not of type file.');
            return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            console.log('The provided file is not an image.');
            return new Response(JSON.stringify({ error: 'The provided file is not an image' }), { status: 400 });
        }

        const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: data,
        })

        const { IpfsHash } = await res.json();

        return Response.json({ cid: IpfsHash }, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const res = await fetch(process.env.PINATA_PRIVATE_GATEWAY_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        })
        const resData = await res.json();
        const files = resData.rows[0]
        return NextResponse.json({ files }, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

}