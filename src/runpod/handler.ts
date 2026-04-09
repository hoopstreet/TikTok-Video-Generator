import { ShortCreator } from '../short-creator/ShortCreator';
import { Kokoro } from '../short-creator/libraries/Kokoro';
import { Whisper } from '../short-creator/libraries/Whisper';
import * as PexelsModule from '../short-creator/libraries/Pexels';
import { Remotion } from '../short-creator/libraries/Remotion';
import { FFMpeg } from '../short-creator/libraries/FFmpeg';

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    // Initialize exactly as the original repo expects
    const pexelsClass = (PexelsModule as any).Pexels || PexelsModule;
    
    const config = { ...input } as any;
    const remotion = new Remotion();
    const kokoro = new Kokoro(process.env.KOKORO_MODEL_PRECISION || 'fp16' as any);
    const whisper = new Whisper(process.env.WHISPER_MODEL || 'base.en');
    const ffmpeg = new FFMpeg();
    const pexels = new pexelsClass(process.env.PEXELS_API_KEY || '');
    const musicManager = null as any; // If you aren't using custom music logic yet

    // PASSING ARGUMENTS IN THE EXACT ORDER FROM YOUR GIT SHOW OUTPUT:
    const creator = new ShortCreator(
      config,       // 1. config
      remotion,     // 2. remotion
      kokoro,       // 3. kokoro
      whisper,      // 4. whisper
      ffmpeg,       // 5. ffmpeg
      pexels,       // 6. pexelsApi
      musicManager  // 7. musicManager
    );

    const result = await (creator as any).createShort({
      ...input,
      voice: input.voice || 'af_heart'
    }); 
    
    return {
      status: "success",
      videoUrl: result.url || result
    };
  } catch (error: any) {
    console.error("❌ Generation Failed:", error);
    return { status: "error", message: error.message };
  }
};
