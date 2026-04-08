process.env.LOG_LEVEL = "debug";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MiniMax } from "./MiniMax";
import { MiniMaxVoiceEnum } from "../../types/shorts";

const DEFAULT_VOICE = MiniMaxVoiceEnum.English_Graceful_Lady;

describe("MiniMax TTS", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("listAvailableVoices", () => {
    it("returns all MiniMax voice IDs", () => {
      const minimax = new MiniMax("test-key");
      const voices = minimax.listAvailableVoices();
      expect(voices).toEqual(Object.values(MiniMaxVoiceEnum));
      expect(voices.length).toBeGreaterThan(0);
    });
  });

  describe("generate", () => {
    it("calls the MiniMax TTS API with correct parameters", async () => {
      const hexAudio = Buffer.from("mock audio data").toString("hex");
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { audio: hexAudio, status: 2 },
            extra_info: { audio_length: 1500 },
            base_resp: { status_code: 0, status_msg: "success" },
          }),
      });

      const minimax = new MiniMax("test-key");
      const result = await minimax.generate("Hello world", DEFAULT_VOICE);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.minimax.io/v1/t2a_v2",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-key",
            "Content-Type": "application/json",
          }),
        }),
      );

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.voice_setting.voice_id).toBe(DEFAULT_VOICE);
      expect(callBody.stream).toBe(false);
      expect(callBody.model).toBe("speech-2.8-hd");

      expect(result.audioLength).toBe(1.5);
      expect(result.audio).toBeInstanceOf(ArrayBuffer);
    });

    it("uses custom base URL when provided", async () => {
      const hexAudio = Buffer.from("mock audio").toString("hex");
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { audio: hexAudio, status: 2 },
            extra_info: { audio_length: 1000 },
            base_resp: { status_code: 0, status_msg: "success" },
          }),
      });

      const minimax = new MiniMax("test-key", "https://custom.example.com");
      await minimax.generate("Hello", DEFAULT_VOICE);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://custom.example.com/v1/t2a_v2",
        expect.anything(),
      );
    });

    it("throws on HTTP error response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      });

      const minimax = new MiniMax("bad-key");
      await expect(
        minimax.generate("Hello", DEFAULT_VOICE),
      ).rejects.toThrow("MiniMax TTS API error: 401 Unauthorized");
    });

    it("throws on non-zero status_code in response body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            base_resp: { status_code: 1001, status_msg: "Invalid API key" },
          }),
      });

      const minimax = new MiniMax("bad-key");
      await expect(
        minimax.generate("Hello", DEFAULT_VOICE),
      ).rejects.toThrow("MiniMax TTS error: Invalid API key");
    });

    it("decodes hex-encoded audio correctly", async () => {
      const expectedBytes = [0x49, 0x44, 0x33]; // "ID3" MP3 header
      const hexAudio = Buffer.from(expectedBytes).toString("hex");
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { audio: hexAudio, status: 2 },
            extra_info: { audio_length: 500 },
            base_resp: { status_code: 0, status_msg: "success" },
          }),
      });

      const minimax = new MiniMax("test-key");
      const result = await minimax.generate("Hi", DEFAULT_VOICE);

      const resultBytes = Array.from(new Uint8Array(result.audio));
      expect(resultBytes).toEqual(expectedBytes);
    });

    it("converts audio_length from milliseconds to seconds", async () => {
      const hexAudio = Buffer.from("audio").toString("hex");
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { audio: hexAudio, status: 2 },
            extra_info: { audio_length: 3200 },
            base_resp: { status_code: 0, status_msg: "success" },
          }),
      });

      const minimax = new MiniMax("test-key");
      const result = await minimax.generate("Hello", DEFAULT_VOICE);
      expect(result.audioLength).toBe(3.2);
    });
  });

  describe("fromApiKey", () => {
    it("creates instance with the provided API key", () => {
      const minimax = MiniMax.fromApiKey("my-api-key");
      expect(minimax).toBeInstanceOf(MiniMax);
    });
  });
});

describe("MiniMax TTS E2E", () => {
  it.skipIf(!process.env.MINIMAX_API_KEY)(
    "synthesizes speech with real API",
    async () => {
      const minimax = MiniMax.fromApiKey(process.env.MINIMAX_API_KEY!);
      const result = await minimax.generate(
        "Hello, this is a test.",
        MiniMaxVoiceEnum.English_Graceful_Lady,
      );
      expect(result.audio).toBeInstanceOf(ArrayBuffer);
      expect(result.audio.byteLength).toBeGreaterThan(100);
      expect(result.audioLength).toBeGreaterThan(0);
    },
    30000,
  );
});
