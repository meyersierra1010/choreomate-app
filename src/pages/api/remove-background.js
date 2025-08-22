import fetch from 'node-fetch';
import { FormData } from "formdata-node";

const { updateVideoById } = require("./_db.js");


const API_KEY = process.env.UNSCREEN_API_KEY;

const RemoveBackground =  async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // call Unscreen API
        const webhookURL = `https://${process.env.VERCEL_URL}/api/unscreen-webhook`;
        const videoData = req.body;
        console.log('Unscreen webhook URL:' + webhookURL);

        const form = new FormData()
        form.append('video_url', videoData.url);
        form.append('format', 'mp4');
        form.append('background_color', '00ff00');
        form.append('webhook_url', webhookURL);

        const apiResponse = await fetch('https://api.unscreen.com/v1.0/videos', {
            method: 'POST',
            body: form,
            headers: { 'X-Api-Key': API_KEY }
        });
        const data = await apiResponse.json();
        console.log(data);
        const unScreenId = data.data.id;


        await updateVideoById(videoData.id, {
            unScreenId: unScreenId,
        });

        res.status(200).json({ status: "success" });
        
    } catch (error) {
        console.log("remove background", error);
        // Send error response
        res.send({ status: "error", code: error.code, message: error.message });
    }
};


export default RemoveBackground;