//NOT BEING USED

import fetch from 'node-fetch';
import { FormData, File } from "formdata-node";
import got from 'got';

const { updateVideoById } = require("./_db.js");


const API_KEY = process.env.BACKGROUNDREMOVER_API_KEY;

//https://api.backgroundremover.app/static/downloads/09000ce1b4684722b403b51a0394ad40/669cf18d-bd6e-432f-b92d-323d2d9c6795.png

const RemoveBackground =  async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // call Unscreen API
        // const webhookURL = `https://${process.env.VERCEL_URL}/api/unscreen-webhook`;
        const videoData = req.body;
        // console.log('Unscreen webhook URL:' + webhookURL);

        const form = new FormData();
        form.append('convert_to', 'video-backgroundremover');
        form.append('lang', 'en');

        const fileBlob = await urlToBlob(videoData.url);
        form.set('files', fileBlob, 'some-file.mp4');
        const fileTest = form.get('files')
        console.log(fileTest.name);

        const apiResponse = await fetch('https://api.backgroundremover.app/v1/convert/', {
            method: 'POST',
            body: form,
            headers: {
                'Authorization': API_KEY,
            }
        });
        console.log(apiResponse);
        if (!apiResponse.ok) {
            res.send({ status: "error", code: apiResponse.status, message: apiResponse.statusText });
        }
        const data = await apiResponse.json();
        console.log(data);
        // const data = { uuid: 'da08341e4b67493abeb5e233d85c4fbd', domain: 'api3' }
        // const removeUuid = data.uuid;

        //wait for job to finish
        const video = await waitForYobToFinish(data);
        console.log(video);



        // await updateVideoById(videoData.id, {
        //     unScreenId: unScreenId,
        // });

        res.status(200).json({ status: "success" });
        
    } catch (error) {
        console.log("remove background", error);
        // Send error response
        res.send({ status: "error", code: error.code, message: error.message });
    }
};


//fetch endpoint every second until job is done
const waitForYobToFinish = (jobData) => {
    return new Promise(async (resolve, reject) => {
        const form = new FormData();
        form.append('uuid', jobData.uuid);
        form.append('domain', jobData.domain);

        const response = await fetch(`https://api.backgroundremover.app/v1/results/`, {
            body: form,
            method: 'POST',
            headers: {
                'Authorization': API_KEY,
            }
        });

        //'{"files":[{"url":"static/downloads/e76a2e3d93904780a18badf364194702/some-file.mp4.mov","filename":"some-file.mp4.mov"},{"url":"static/downloads/e76a2e3d93904780a18badf364194702/some-file.mp4.gif","filename":"some-file.mp4.gif"}],"failed":[],"finished":true,"queue_count":0,"errors":[]}'
        if (!response.ok) {
            res.send({ status: "error", code: response.status, message: response.statusText });
        }
        const data = await response.json();
        console.log(data);
        resolve(data);
    });
}

const urlToBlob = (url) => {
    return fetch(url).then(res => res.blob());
}


export default RemoveBackground;