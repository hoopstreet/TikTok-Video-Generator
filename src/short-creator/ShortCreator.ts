import fs from "fs-extra";
import cuid from "cuid";
import path from "path";
import https from "https";
import { logger } from "../logger";

export class ShortCreator {
  private queue: any[] = [];
  constructor(private config: any, private remotion: any, private kokoro: any, private whisper: any, private ffmpeg: any, private musicManager: any) {}

  public addToQueue(sceneInput: any[], config: any): string {
    const id = cuid();
    this.queue.push({ sceneInput, config, id });
    if (this.queue.length === 1) this.processQueue();
    return id;
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) return;
    const { sceneInput, config, id } = this.queue[0];
    try {
      await this.createShort(id, sceneInput, config);
    } catch (error) { logger.error(error); } finally {
      this.queue.shift();
      this.processQueue();
    }
  }

  private async createShort(videoId: string, inputScenes: any[], config: any): Promise<string> {
    const scenes: any[] = [];
    let totalDuration = 0;
    const tempFiles: string[] = [];

    for (const scene of inputScenes) {
      const audio = await this.kokoro.generate(scene.text, config.voice || "af_heart");
      const tempId = cuid();
      const tempMp3Path = path.join(this.config.tempDirPath, `${tempId}.mp3`);
      const tempImgPath = path.join(this.config.tempDirPath, `${tempId}.jpg`);
      tempFiles.push(tempMp3Path, tempImgPath);

      await new Promise((res) => {
        const file = fs.createWriteStream(tempImgPath);
        https.get(scene.imageURL, (resp) => { resp.pipe(file); file.on("finish", () => { file.close(); res(true); }); });
      });

      await this.ffmpeg.saveToMp3(audio.audio, tempMp3Path);
      const captions = await this.whisper.CreateCaption(tempMp3Path);

      scenes.push({
        captions,
        video: `http://localhost:${this.config.port}/api/tmp/${tempId}.jpg`,
        audio: { url: `http://localhost:${this.config.port}/api/tmp/${tempId}.mp3`, duration: audio.audioLength }
      });
      totalDuration += audio.audioLength;
    }

    const selectedMusic = this.musicManager.musicList()[0]; 
    await this.remotion.render({ music: selectedMusic, scenes, config: { durationMs: totalDuration * 1000, ...config } }, videoId, config.orientation);
    tempFiles.forEach(f => fs.removeSync(f));
    return videoId;
  }

  public status(id: string) { return fs.existsSync(path.join(this.config.videosDirPath, `${id}.mp4`)) ? "ready" : "processing"; }
  public getVideo(id: string) { return fs.readFileSync(path.join(this.config.videosDirPath, `${id}.mp4`)); }
}
