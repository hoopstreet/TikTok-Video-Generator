import { exec } from "child_process";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export const uploadVideo = async (filePath: string, fileName: string) => {
    // We use the HF CLI to upload to the bucket handle
    // Format: hf buckets cp [local] hf://buckets/[owner]/[bucket-name]/[path]
    const bucketHandle = "hf://buckets/hoopstreet/TikTok-Video-Generator-storage";
    const remotePath = `${bucketHandle}/videos/${fileName}`;

    try {
        console.log(`🚀 Syncing to HF Bucket: ${fileName}`);
        // Ensure you have HF_TOKEN set in RunPod Env Vars
        await execPromise(`hf buckets cp ${filePath} ${remotePath}`);
        
        // Return the browser-viewable URL
        return `https://huggingface.co/buckets/hoopstreet/TikTok-Video-Generator-storage/videos/${fileName}`;
    } catch (error) {
        console.error("❌ HF Bucket Upload Failed:", error);
        throw error;
    }
};
