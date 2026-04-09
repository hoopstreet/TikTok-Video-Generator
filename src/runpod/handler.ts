import { ShortCreator } from '../short-creator/ShortCreator';
import { Kokoro } from '../short-creator/libraries/Kokoro';
import { Whisper } from '../short-creator/libraries/Whisper';
import { Pexels } from '../short-creator/libraries/Pexels';

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    // 1. Initialize libraries using settings from your original source
    const pexels = new Pexels(process.env.PEXELS_API_KEY || '');
    const whisper = new Whisper(process.env.WHISPER_MODEL || 'base.en');
    const kokoro = new Kokoro(process.env.KOKORO_MODEL_PRECISION || 'fp16' as any);

    // 2. Initialize Creator with the 7 arguments expected by the constructor
    const creator = new ShortCreator(
      pexels,
      kokoro,
      whisper,
      process.env.DATA_DIR_PATH || '/app/data',
      null as any, // Logger placeholder
      null as any, // Metadata placeholder
      null as any  // Cache placeholder
    );

    // 3. Run the generation (using 'any' to access the private method)
    const result = await (creator as any).createShort({
      ...input,
      voice: input.voice || 'af_heart', // Default from your instructions
      orientation: input.orientation || 'portrait',
      music: input.music || 'random'
    }); 
    
    return {
      status: "success",
      videoUrl: result.url || result,
      metadata: result.metadata || {}
    };
  } catch (error: any) {
    console.error("❌ Generation Failed:", error);
    return { status: "error", message: error.message };
  }
};
