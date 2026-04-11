import path from 'path';
import fs from 'fs-extra';

export class Kokoro {
  private precision: string;

  constructor(precision: string = 'fp16') {
    this.precision = precision;
    console.log(`🎙️ Kokoro initialized with precision: ${this.precision}`);
  }

  public listAvailableVoices(): string[] {
    return ['af_heart', 'af_bella', 'af_nicole', 'af_sky', 'am_adam', 'am_michael', 'bf_isabelle', 'bf_emma', 'bm_george', 'bm_lewis'];
  }

  public async generate(text: string, voice: string): Promise<ArrayBuffer> {
    console.log(`🔊 Kokoro generating audio for: "${text.substring(0, 20)}..." using voice: ${voice}`);
    
    // Safety check to prevent the 'undefined' error
    try {
      // Mocking the buffer return for now to stabilize the pipeline
      // Replace this with your actual ONNX session call if you have it
      return new ArrayBuffer(8); 
    } catch (error) {
      console.error("❌ Kokoro Generation Error:", error);
      throw error;
    }
  }
}
