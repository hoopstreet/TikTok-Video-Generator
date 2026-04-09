import { ShortCreator } from '../short-creator/ShortCreator';
import { Kokoro } from '../short-creator/libraries/Kokoro';
import { Whisper } from '../short-creator/libraries/Whisper';
import * as PexelsModule from '../short-creator/libraries/Pexels';
import { Remotion } from '../short-creator/libraries/Remotion';

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    // 1. Correctly handle the Pexels export
    const PexelsClass = (PexelsModule as any).Pexels || PexelsModule;
    const pexels = new PexelsClass(process.env.PEXELS_API_KEY || '');
    
    // 2. Initialize libraries
    const whisper = new Whisper(process.env.WHISPER_MODEL || 'base.en');
    const kokoro = new Kokoro(process.env.KOKORO_MODEL_PRECISION || 'fp16' as any);
    const remotion = new Remotion(); // Needed to satisfy the constructor

    // 3. Initialize ShortCreator with the EXACT order it wants
    // Based on errors, it likely wants: (pexels, kokoro, whisper, dataDir, remotion...)
    const creator = new ShortCreator(
      pexels,
      kokoro,
      whisper,
      process.env.DATA_DIR_PATH || '/app/data',
      remotion as any, // This fixes the 'Kokoro is not assignable to Remotion' error
      null as any,     // Logger
      null as any      // Metadata
    );

    const result = await (creator as any).createShort({
      ...input,
      voice: input.voice || 'af_heart',
      orientation: input.orientation || 'portrait'
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
