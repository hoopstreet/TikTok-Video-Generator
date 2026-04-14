"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortCreator = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const cuid_1 = __importDefault(require("cuid"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const logger_1 = require("../logger");
class ShortCreator {
    config;
    remotion;
    kokoro;
    whisper;
    ffmpeg;
    musicManager;
    queue = [];
    constructor(config, remotion, kokoro, whisper, ffmpeg, musicManager) {
        this.config = config;
        this.remotion = remotion;
        this.kokoro = kokoro;
        this.whisper = whisper;
        this.ffmpeg = ffmpeg;
        this.musicManager = musicManager;
    }
    addToQueue(sceneInput, config) {
        const id = (0, cuid_1.default)();
        this.queue.push({ sceneInput, config, id });
        if (this.queue.length === 1)
            this.processQueue();
        return id;
    }
    async processQueue() {
        if (this.queue.length === 0)
            return;
        const { sceneInput, config, id } = this.queue[0];
        try {
            await this.createShort(id, sceneInput, config);
        }
        catch (error) {
            logger_1.logger.error(error);
        }
        finally {
            this.queue.shift();
            this.processQueue();
        }
    }
    async createShort(videoId, inputScenes, config) {
        const scenes = [];
        let totalDuration = 0;
        const tempFiles = [];
        for (const scene of inputScenes) {
            const audio = await this.kokoro.generate(scene.text, config.voice || "af_heart");
            const tempId = (0, cuid_1.default)();
            const tempMp3Path = path_1.default.join(this.config.tempDirPath, `${tempId}.mp3`);
            const tempImgPath = path_1.default.join(this.config.tempDirPath, `${tempId}.jpg`);
            tempFiles.push(tempMp3Path, tempImgPath);
            await new Promise((res) => {
                const file = fs_extra_1.default.createWriteStream(tempImgPath);
                https_1.default.get(scene.imageURL, (resp) => { resp.pipe(file); file.on("finish", () => { file.close(); res(true); }); });
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
        tempFiles.forEach(f => fs_extra_1.default.removeSync(f));
        return videoId;
    }
    status(id) { return fs_extra_1.default.existsSync(path_1.default.join(this.config.videosDirPath, `${id}.mp4`)) ? "ready" : "processing"; }
    getVideo(id) { return fs_extra_1.default.readFileSync(path_1.default.join(this.config.videosDirPath, `${id}.mp4`)); }
}
exports.ShortCreator = ShortCreator;
