import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':

            const { eventCastHash, fId, cursor } = req.query;

            if (!eventCastHash) {
                return res.status(400).json({ error: 'eventCastHash is required' });
            }

            const options = {
                method: 'GET',
                headers: { accept: 'application/json', api_key: process.env.NEYNAR_API_KEY }
            };

            try {
                const fIdInt = parseInt(fId);
                let url = `https://api.neynar.com/v2/farcaster/cast/conversation?type=hash&reply_depth=2&include_chronological_parent_casts=false&limit=2&viewer_fid=${fIdInt}&identifier=${eventCastHash}`;

                if (cursor) {
                    url += `&cursor=${cursor}`;
                }

                const response = await fetch(url, options);
                const data = await response.json();
                res.status(200).json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while fetching the event feed' });
            }

            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} is not allowed.`)
    }
}

export default handler