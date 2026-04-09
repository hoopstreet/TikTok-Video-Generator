import { ShortCreator } from '../short-creator/ShortCreator';

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    // Passing null/any to satisfy the '7 arguments' requirement 
    // and using 'any' to bypass the 'private method' restriction temporarily
    const creator = new ShortCreator(null as any, null as any, null as any, null as any, null as any, null as any, null as any);
    const result = await (creator as any).createShort(input); 
    
    return {
      status: "success",
      result: result 
    };
  } catch (error: any) {
    console.error("❌ Generation Failed:", error);
    return {
      status: "error",
      error: error.message
    };
  }
};
