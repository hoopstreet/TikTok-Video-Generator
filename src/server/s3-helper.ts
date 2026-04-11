import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs-extra";

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
});

export const uploadVideo = async (filePath: string, fileName: string) => {
    const fileStream = fs.createReadStream(filePath);
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `videos/${fileName}`,
        Body: fileStream,
        ContentType: "video/mp4",
        ACL: "public-read",
    });

    await s3Client.send(command);
    return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/videos/${fileName}`;
};
