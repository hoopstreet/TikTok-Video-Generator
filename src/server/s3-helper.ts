import fs from "fs-extra";
import path from "path";

// This is the path where your HF Bucket is mounted (check your HF settings)
const MOUNT_PATH = process.env.HF_BUCKET_MOUNT_PATH || '/data';

export const uploadVideo = async (filePath: string, fileName: string) => {
    const destination = path.join(MOUNT_PATH, 'videos', fileName);
    
    // Ensure the destination directory exists in the bucket
    await fs.ensureDir(path.join(MOUNT_PATH, 'videos'));
    
    // Copy the file from /tmp to the mounted bucket
    await fs.copy(filePath, destination);
    
    console.log(`✅ Video saved to bucket: ${destination}`);
    
    // Return the path or a signed URL if your setup supports it
    return destination;
};
