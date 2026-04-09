import { Kokoro as KokoroAPI } from "../../types/shorts";

export class Kokoro implements KokoroAPI {
  private model: any;

  constructor(precision: 'fp16' | 'fp32' = 'fp32') {
    console.log("Initializing Kokoro with precision:", precision);
  }

  public async generate(text: string, voice: string): Promise<ArrayBuffer> {
    // This is the core logic that needs the buffer cast
    const audio = await (this.model as any).generate(text, voice);
    return Buffer.from(audio).buffer as ArrayBuffer;
  }
}
