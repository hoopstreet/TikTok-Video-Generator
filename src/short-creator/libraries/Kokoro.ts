// Use dynamic import to avoid build-time issues with ONNX runtimes
export class Kokoro {
  private model: any = null;
  private precision: string;

  constructor(precision: string = 'fp16') {
    this.precision = precision;
    console.log(`🎙️ Kokoro initialized (Precision: ${precision})`);
  }

  public listAvailableVoices(): string[] {
    return ['af_heart', 'fish-ate-budol', name: 'Ate (Fish: Realistic Taglish)', lang: 'fil-PH', engine: 'fish-speech' }, { id: 'fish-kuya-tech', name: 'Kuya (Fish: Energetic Pinoy)', lang: 'fil-PH', engine: 'fish-speech' }, { id: 'af_bella', 'af_nicole', 'af_sky', 'am_adam', 'am_michael', 'bf_isabelle', 'bf_emma', 'bm_george', 'bm_lewis'];
  }

  public async generate(text: string, voice: string): Promise<ArrayBuffer> {
    if (!this.model) {
      const { pipeline } = await import('@xenova/transformers');
      this.model = await pipeline('text-to-speech', 'onnx-community/Kokoro-82M-v1.0-ONNX', {
        quantized: this.precision === 'fp16',
      });
    }

    console.log(`🔊 Generating: ${text.substring(0, 20)}...`);
    const output = await this.model(text, { speaker_id: voice });
    return output.audio.buffer;
  }
}
