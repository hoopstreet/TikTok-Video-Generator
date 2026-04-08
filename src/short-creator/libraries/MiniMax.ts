import { logger } from "../../config";
import { MiniMaxVoiceEnum } from "../../types/shorts";

export type MiniMaxVoice = `${MiniMaxVoiceEnum}`;

export class MiniMax {
  constructor(
    private apiKey: string,
    private baseUrl: string = "https://api.minimax.io",
  ) {}

  async generate(
    text: string,
    voice: MiniMaxVoice,
    model: string = "speech-2.8-hd",
  ): Promise<{ audio: ArrayBuffer; audioLength: number }> {
    const response = await fetch(`${this.baseUrl}/v1/t2a_v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        text,
        stream: false,
        voice_setting: {
          voice_id: voice,
          speed: 1,
          vol: 1,
          pitch: 0,
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3",
          channel: 1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `MiniMax TTS API error: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();

    if (result.base_resp?.status_code !== 0) {
      throw new Error(
        `MiniMax TTS error: ${result.base_resp?.status_msg ?? "Unknown error"}`,
      );
    }

    const buf = Buffer.from(result.data.audio, "hex");
    const audio = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength,
    ) as ArrayBuffer;
    const audioLength = (result.extra_info?.audio_length ?? 0) / 1000;

    logger.debug(
      { text, voice, audioLength },
      "Audio generated with MiniMax TTS",
    );

    return { audio, audioLength };
  }

  listAvailableVoices(): MiniMaxVoice[] {
    return Object.values(MiniMaxVoiceEnum) as MiniMaxVoice[];
  }

  static fromApiKey(apiKey: string): MiniMax {
    return new MiniMax(apiKey);
  }
}
