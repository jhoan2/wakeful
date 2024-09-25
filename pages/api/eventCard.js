const handler = async (req, res) => {
    const { reaction_type, signer_uuid, target, target_author_fid, idem, text, embeds, parent, parent_author_fid } = req.body;

    switch (req.method) {
        case 'GET':
            const { url, hash } = req.query;
            if (!url && !hash) {
                return res.status(400).json({ error: 'Missing URL or hash parameter' });
            }

            const options = {
                method: 'GET',
                headers: { accept: 'application/json', api_key: 'NEYNAR_API_DOCS' }
            };

            try {
                const identifier = url || hash;
                const type = url ? 'url' : 'hash';
                const response = await fetch(`https://api.neynar.com/v2/farcaster/cast?identifier=${identifier}&type=${type}`, options);
                const data = await response.json();
                res.status(200).json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while fetching the cast' });
            }
            break;
        case 'POST':
            if (!signer_uuid || !text) {
                return res.status(400).json({ error: 'Missing required fields in request body' });
            }

            const postOptions = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    api_key: process.env.NEYNAR_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    embeds: embeds,
                    signer_uuid: signer_uuid,
                    text: text,
                    parent: parent,
                    parent_author_fid: parent_author_fid
                })
            };

            fetch('https://api.neynar.com/v2/farcaster/cast', postOptions)
                .then(response => response.json())
                .then(() => {
                    res.status(200).json({ message: 'success' });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: 'An error occurred while creating the cast' });
                });
            break;
        case 'PATCH':

            if (!reaction_type || !signer_uuid || !target || !target_author_fid) {
                return res.status(400).json({ error: 'Missing required fields in request body' });
            }

            try {
                const options = {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        api_key: process.env.NEYNAR_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        reaction_type: reaction_type,
                        signer_uuid: signer_uuid,
                        target: target,
                        target_author_fid: target_author_fid,
                        idem: idem
                    })
                };

                const response = await fetch('https://api.neynar.com/v2/farcaster/reaction', options)
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${data.message || 'Unknown error'}`);
                }

                res.status(200).json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while fetching the event feed' });
            }

            break;

        case 'DELETE':
            const { eventCastHash } = req.query;
            const { signerUuid } = req.body;

            if (!signerUuid) {
                return res.status(400).json({ error: 'signer_uuid is required in the request body' });
            }

            if (!eventCastHash) {
                return res.status(400).json({ error: 'eventCastHash is required' });
            }

            try {
                const options = {
                    method: 'DELETE',
                    headers: {
                        accept: 'application/json',
                        api_key: process.env.NEYNAR_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ signer_uuid: signerUuid, target_hash: eventCastHash })
                };

                const response = await fetch('https://api.neynar.com/v2/farcaster/cast', options);
                const data = await response.json();

                if (response.ok) {
                    res.status(200).json({ message: 'Cast deleted successfully', data });
                } else {
                    res.status(response.status).json({ error: 'Failed to delete cast', data });
                }

            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while deleting the cast' });
            }
            break;
        default:
            res.setHeader('Allow', ['DELETE', 'POST', 'GET', 'PATCH'])
            res.status(405).end(`Method ${req.method} is not allowed.`)
    }
}

export default handler