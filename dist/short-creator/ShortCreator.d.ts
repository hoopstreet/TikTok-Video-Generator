export declare class ShortCreator {
    private config;
    private remotion;
    private kokoro;
    private whisper;
    private ffmpeg;
    private musicManager;
    private queue;
    constructor(config: any, remotion: any, kokoro: any, whisper: any, ffmpeg: any, musicManager: any);
    addToQueue(sceneInput: any[], config: any): string;
    private processQueue;
    private createShort;
    status(id: string): "ready" | "processing";
    getVideo(id: string): any;
}
