import { generateVideo } from '../engine/generator'; // Adjust path to your actual generator

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    // This calls your actual video engine
    const result = await generateVideo(input); 
    
    return {
      status: "success",
      videoUrl: result.url,
      metadata: result.metadata
    };
  } catch (error) {
    console.error("❌ Generation Failed:", error);
    return {
      status: "error",
      error: error.message
    };
  }
};
