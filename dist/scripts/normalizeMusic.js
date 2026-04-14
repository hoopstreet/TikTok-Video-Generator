"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMusic = normalizeMusic;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = __importDefault(require("path"));
import("@ffmpeg-installer/ffmpeg");
const fs_extra_1 = __importDefault(require("fs-extra"));
const logger_1 = require("../logger");
const music_1 = require("../short-creator/music");
const config_1 = require("../config");
async function normalize(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)()
            .input(inputPath)
            .audioCodec("libmp3lame")
            .audioBitrate(96)
            .audioChannels(2)
            .audioFrequency(44100)
            .audioFilter("loudnorm,volume=0.1")
            .toFormat("mp3")
            .on("error", (err) => {
            logger_1.logger.error(err, "Error normalizing audio:");
            reject(err);
        })
            .save(outputPath)
            .on("end", () => {
            logger_1.logger.debug("Audio normalization complete");
            resolve(outputPath);
        });
    });
}
async function normalizeMusic() {
    const config = new config_1.Config();
    const musicManager = new music_1.MusicManager(config);
    try {
        musicManager.ensureMusicFilesExist();
    }
    catch (error) {
        logger_1.logger.error(error, "Missing music files");
        process.exit(1);
    }
    const musicFiles = musicManager.musicList();
    const normalizedDir = path_1.default.join(config.musicDirPath, "normalized");
    fs_extra_1.default.ensureDirSync(normalizedDir);
    for (const musicFile of musicFiles) {
        const inputPath = path_1.default.join(config.musicDirPath, musicFile.file);
        const outputPath = path_1.default.join(normalizedDir, musicFile.file);
        logger_1.logger.debug({ inputPath, outputPath }, "Normalizing music file");
        await normalize(inputPath, outputPath);
    }
}
normalizeMusic()
    .then(() => {
    logger_1.logger.info("Music normalization completed successfully - make sure to replace the original files with the normalized ones");
})
    .catch((error) => {
    logger_1.logger.error(error, "Error normalizing music files");
});
