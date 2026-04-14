"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFMpeg = void 0;
const logger_1 = require("../../logger");
class FFMpeg {
    logger = logger_1.logger.child({ module: "FFMpeg" });
    ffmpegPath = "ffmpeg";
    constructor() {
        this.logger.info("FFmpeg path set to:", this.ffmpegPath);
    }
}
exports.FFMpeg = FFMpeg;
