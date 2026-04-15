const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT || "https://s3.amazonaws.com",
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
});

async function uploadToS3(filePath, fileName) {
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
        ContentType: "video/mp4",
    };
    return s3Client.send(new PutObjectCommand(uploadParams));
}

module.exports = { uploadToS3 };
