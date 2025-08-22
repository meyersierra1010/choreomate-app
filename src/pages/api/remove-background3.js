import fetch from 'node-fetch';

const { updateVideoById } = require("./_db.js");

//https://replicate.com/arielreplicate/robust_video_matting

const API_KEY = process.env.REPLICATE_API_TOKEN;

const RemoveBackground = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // call Replicate API
        const webhookURL = `https://${process.env.VERCEL_URL}/api/replicate-webhook`;
        const videoData = req.body;
        console.log('Replicate webhook URL:' + webhookURL);

        const apiResponse = await fetch("https://api.replicate.com/v1/predictions", {
            method: 'POST',
            headers: {
                Authorization: `Token ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Pinned to a specific version
                version: '73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac',
                input: { input_video: videoData.url },
                webhook: webhookURL,
            }),
        });


        // "completed_at": null,
        // "created_at": "2023-03-08T17:54:26.385912Z",
        // "error": null,
        // "id": "j6t4en2gxjbnvnmxim7ylcyihu",
        // "input": {"input_video": "..."},
        // "logs": null,
        // "metrics": {},
        // "output": null,
        // "started_at": null,
        // "status": "starting",
        // "version": "73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac"


        if (apiResponse.status !== 201) {
            let error = await apiResponse.json();
            console.log('Replicate Error:' + JSON.stringify({ detail: error }));
            res.statusCode = 500;
            res.end(JSON.stringify({ detail: error.detail }));
            return;
        }

        const data = await apiResponse.json();
        console.log(data);
        const responseId = data.id;

        await updateVideoById(videoData.id, {
            unScreenId: responseId,
        });

        res.status(200).json({ status: "success" });

    } catch (error) {
        console.log("remove background", error);
        // Send error response
        res.send({ status: "error", code: error.code, message: error.message });
    }
};


export default RemoveBackground;