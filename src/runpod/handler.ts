import { ShortCreator } from '../short-creator/ShortCreator';
import { Kokoro } from '../short-creator/libraries/Kokoro';
import { Whisper } from '../short-creator/libraries/Whisper';
import * as PexelsModule from '../short-creator/libraries/Pexels';
import { Remotion } from '../short-creator/libraries/Remotion';

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    const PexelsClass = (PexelsModule as any).Pexels || PexelsModule;
    
    // The original source requires these configurations
    const pexels = new PexelsClass(process.env.PEXELS_API_KEY || '');
    const whisper = new Whisper(process.env.WHISPER_MODEL || 'base.en');
    const kokoro = new Kokoro(process.env.KOKORO_MODEL_PRECISION || 'fp16' as any);
    
    // Remotion requires a bundled path and config (Fixing TS2554)
    const remotion = new Remotion(); 

    // We align with the original constructor: 
    // Usually: (pexels, kokoro, whisper, dataDir, remotion, config, logger)
    const creator = new ShortCreator(
      pexels,
      kokoro,
      whisper,
      process.env.DATA_DIR_PATH || '/app/data',
      remotion as any, 
      {} as any, // Config object (Fixing TS2345)
      console as any // Logger
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
