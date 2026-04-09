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
    const pexelsClass = (PexelsModule as any).Pexels || PexelsModule;
    
    // 1. Prepare all sub-libraries
    const config = { ...input } as any;
    
    // Fixing TS2554: Passing empty strings/objects to satisfy Remotion(bundle, config)
    const remotion = new Remotion("" as any, {} as any); 
    
    const kokoro = new Kokoro(process.env.KOKORO_MODEL_PRECISION || 'fp16' as any);
    const whisper = new Whisper(process.env.WHISPER_MODEL || 'base.en');
    const ffmpeg = new FFMpeg();
    const pexels = new pexelsClass(process.env.PEXELS_API_KEY || '');
    const musicManager = null as any;

    // 2. Initialize using the EXACT sequence from the source code:
    // (config, remotion, kokoro, whisper, ffmpeg, pexelsApi, musicManager)
    const creator = new ShortCreator(
      config,       // 1. config (Fixes TS2345)
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
