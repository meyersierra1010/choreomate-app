import S3 from 'aws-sdk/clients/s3';
import { uuid } from 'uuidv4';
import stream from 'stream';
import path from 'path';
import got from 'got';

const { updateVideoByUnScreenId } = require("./_db.js");

const s3 = new S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
});

const API_KEY = process.env.UNSCREEN_API_KEY;

const UnscreenWebhook =  async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    console.log(req.body);
    const resData = req.body;

    try {
        if (resData.type === 'video:done') {
            const videoUrl = resData.data.attributes.result_url;
            const fileExtension = path.extname(videoUrl);
            const fileNameKey = `${uuid()}${fileExtension}`;
            const { writeStream, promise } = uploadStream({ Bucket: process.env.AMAZON_BUCKET_NAME, Key: fileNameKey });

            //upload files to s3
            //const readStream = fs.createReadStream(process.cwd() + '/video.mp4');
            const readStream = got.stream(videoUrl);
            const pipeline = readStream.pipe(writeStream);
            const resultUpload = await promise;

            //save resData.attributes.result_url and resData.attributes.poster_frame_url to db
            await updateVideoByUnScreenId(resData.data.id, {
                unScreenUrl: resultUpload.Location
            });

            console.log(resultUpload);
            res.status(200).json({ status: "success" });

        }
        
    } catch (error) {
        console.log("Un screen webhook error", error);
        // Send error response
        res.send({ status: "error", code: error.code, message: error.message });
        
    }
};

const uploadStream = ({ Bucket, Key }) => {
    const pass = new stream.PassThrough();
    return {
        writeStream: pass,
        promise: s3.upload({
            Bucket, 
            Key, 
            Body: pass, 
            ACL: 'public-read', 
            ContentType: 'video/mp4',
            }).promise(),
    };
}

export default UnscreenWebhook;