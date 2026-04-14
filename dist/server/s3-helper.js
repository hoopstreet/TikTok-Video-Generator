"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = void 0;
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const execPromise = util_1.default.promisify(child_process_1.exec);
const uploadVideo = async (filePath, fileName) => {
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
    }
    catch (error) {
        console.error("❌ HF Bucket Upload Failed:", error);
        throw error;
    }
};
exports.uploadVideo = uploadVideo;
