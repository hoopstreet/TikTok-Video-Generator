import { ShortCreator } from '../short-creator/ShortCreator';
import { Kokoro } from '../short-creator/libraries/Kokoro';
import { Whisper } from '../short-creator/libraries/Whisper';
import * as PexelsModule from '../short-creator/libraries/Pexels';
import { Remotion } from '../short-creator/libraries/Remotion';
import { FFMpeg } from '../short-creator/libraries/FFmpeg';
import { MusicManager } from '../short-creator/music';

export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 RunPod Worker received job:", input);
  
  try {
    const pexelsClass = (PexelsModule as any).Pexels || PexelsModule;
    
    // 1. Prepare Configuration (typed as any to bypass strict checks)
    const config = { 
      ...input,
      outputDir: process.env.DATA_DIR_PATH || '/app/data'
    } as any;
    
    // 2. Initialize Sub-Libraries using your specific structure
    const remotion = new Remotion("" as any, {} as any); 
    const kokoro = new Kokoro(process.env.KOKORO_MODEL_PRECISION || 'fp16' as any);
    const whisper = new Whisper(process.env.WHISPER_MODEL || 'base.en');
    const ffmpeg = new FFMpeg();
    const pexels = new pexelsClass(process.env.PEXELS_API_KEY || '');
    const musicManager = new MusicManager(config); // Uses the class from ../short-creator/music

    // 3. Initialize ShortCreator with the exact 7 arguments found in your grep
    const creator = new ShortCreator(
      config,        // 1. config
      remotion,      // 2. remotion
      kokoro,        // 3. kokoro
      whisper,       // 4. whisper
      ffmpeg,        // 5. ffmpeg
      pexels,        // 6. pexelsApi
      musicManager   // 7. musicManager
    );

    const result = await (creator as any).createShort({
      ...input,
    { id: '"fish_ate_budol"', name: 'Ate (Fish: Realistic Taglish)', lang: 'fil-PH', engine: 'fish-speech' },
    { id: 'fish_kuya_tech', name: 'Kuya (Fish: Energetic Pinoy)', lang: 'fil-PH', engine: 'fish-speech' },
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
