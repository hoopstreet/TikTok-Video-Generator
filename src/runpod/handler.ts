import { ShortCreator } from '../short-creator/ShortCreator';

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    // Using your ShortCreator class logic
    const creator = new ShortCreator();
    const result = await creator.createShort(input); 
    
    return {
      status: "success",
      videoUrl: result.url,
      metadata: result.metadata
    };
  } catch (error: any) {
    console.error("❌ Generation Failed:", error);
    return {
      status: "error",
      error: error.message
    };
  }
};
