import S3 from 'aws-sdk/clients/s3';
import { uuid } from 'uuidv4';
import path from 'path';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
});

//https://github.com/vercel/examples/blob/main/solutions/aws-s3-image-upload/pages/api/upload-url.ts


const UploadUrl = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  //generate file name
  const fileType = req.query.fileType;
  const fileName = req.query.file;
  const fileExtension = path.extname(fileName);
  const fileNameKey = `${uuid()}${fileExtension}`;

  //{fields, url}
  const post = await s3.createPresignedPost({
    Bucket: process.env.AMAZON_BUCKET_NAME,
    Fields: {
      key: fileNameKey,
      'Content-Type': fileType,
      acl: 'public-read'
    },
    Expires: 60, // seconds
    Conditions: [
      // ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  const videoUrl = `${process.env.AMAZON_CDN_URL}/${fileNameKey}`;
  const result = {
    post: post,
    videoUrl: videoUrl
  };

  res.status(200).json(result);
};


export default UploadUrl;