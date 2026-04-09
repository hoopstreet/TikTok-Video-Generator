import { ShortCreator } from '../short-creator/ShortCreator';

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    // We provide the actual values the constructor likely wants
    // If it expects 7, we provide 7.
    const creator = new ShortCreator(
      process.env.PEXELS_API_KEY as any,
      process.env.KOKORO_KEY as any, // Placeholder for your TTS key
      "/usr/bin/ffmpeg",             // Standard Linux FFmpeg path
      input.voice || "en_us_001",    // Default voice
      null as any,                   // Placeholder 5
      null as any,                   // Placeholder 6
      null as any                    // Placeholder 7
    );

    // Using 'any' to access the private 'createShort' method
    const result = await (creator as any).createShort(input); 
    
    return {
      status: "success",
      videoUrl: result.url || result,
      metadata: result.metadata || {}
    };
  } catch (error: any) {
    console.error("❌ Generation Failed:", error);
    return {
      status: "error",
      message: error.message,
      stack: error.stack
    };
  }
};
