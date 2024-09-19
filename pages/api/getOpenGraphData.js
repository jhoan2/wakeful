const ogs = require('open-graph-scraper');

const handler = async (req, res) => {

    switch (req.method) {
        case 'GET':
            const { url } = req.query
            try {
                const { result, error } = await ogs({ url: url });
                if (error) {
                    console.log(error)
                    return res.status(500).send({ message: error })
                }
                return res.status(200).send({ result: result })
            } catch (error) {
                return res.status(500).send({ message: error.message })
            }
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} is not allowed.`)
    }
}

export default handler 