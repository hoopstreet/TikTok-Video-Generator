import { pipeline } from '@xenova/transformers';

export class Kokoro {
  private model: any = null;
  private precision: string;

  constructor(precision: string = 'fp16') {
    this.precision = precision;
    console.log(`🎙️ Kokoro initializing with precision: ${precision}`);
  }

  private async initModel() {
    if (!this.model) {
      // Loading from Hugging Face Hub as defined in your config
      this.model = await pipeline('text-to-speech', 'onnx-community/Kokoro-82M-v1.0-ONNX', {
        quantized: this.precision === 'fp16',
      });
    }
  }

  public listAvailableVoices(): string[] {
    return ['af_heart', 'af_bella', 'af_nicole', 'af_sky', 'am_adam', 'am_michael', 'bf_isabelle', 'bf_emma', 'bm_george', 'bm_lewis'];
  }

  public async generate(text: string, voice: string): Promise<ArrayBuffer> {
    await this.initModel();
    console.log(`🔊 Kokoro generating audio for: "${text.substring(0, 20)}..."`);
    
    const output = await this.model(text, { speaker_id: voice });
    // Convert the float32 array output to an ArrayBuffer
    return output.audio.buffer;
  }
}
