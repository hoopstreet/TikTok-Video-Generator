"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whisper = exports.ErrorWhisper = void 0;
const install_whisper_cpp_1 = require("@remotion/install-whisper-cpp");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../logger");
exports.ErrorWhisper = new Error("There was an error with WhisperCpp");
class Whisper {
    config;
    constructor(config) {
        this.config = config;
    }
    static async init(config) {
        if (!config.runningInDocker) {
            logger_1.logger.debug("Installing WhisperCpp");
            await (0, install_whisper_cpp_1.installWhisperCpp)({
                to: config.whisperInstallPath,
                version: config.whisperVersion,
                printOutput: true,
            });
            logger_1.logger.debug("WhisperCpp installed");
            logger_1.logger.debug("Downloading Whisper model");
            await (0, install_whisper_cpp_1.downloadWhisperModel)({
                model: config.whisperModel,
                folder: path_1.default.join(config.whisperInstallPath, "models"),
                printOutput: config.whisperVerbose,
                onProgress: (downloadedBytes, totalBytes) => {
                    const progress = `${Math.round((downloadedBytes / totalBytes) * 100)}%`;
                    logger_1.logger.debug({ progress, model: config.whisperModel }, "Downloading Whisper model");
                },
            });
            // todo run the jfk command to check if everything is ok
            logger_1.logger.debug("Whisper model downloaded");
        }
        return new Whisper(config);
    }
    // todo shall we extract it to a Caption class?
    async CreateCaption(audioPath) {
        logger_1.logger.debug({ audioPath }, "Starting to transcribe audio");
        const { transcription } = await (0, install_whisper_cpp_1.transcribe)({
            model: this.config.whisperModel,
            whisperPath: this.config.whisperInstallPath,
            modelFolder: path_1.default.join(this.config.whisperInstallPath, "models"),
            whisperCppVersion: this.config.whisperVersion,
            inputPath: audioPath,
            tokenLevelTimestamps: true,
            printOutput: this.config.whisperVerbose,
            onProgress: (progress) => {
                logger_1.logger.debug({ audioPath }, `Transcribing is ${progress} complete`);
            },
        });
        logger_1.logger.debug({ audioPath }, "Transcription finished, creating captions");
        const captions = [];
        transcription.forEach((record) => {
            if (record.text === "") {
                return;
            }
            record.tokens.forEach((token) => {
                if (token.text.startsWith("[_TT")) {
                    return;
                }
                // if token starts without space and the previous node didn't have space either, merge them
                if (captions.length > 0 &&
                    !token.text.startsWith(" ") &&
                    !captions[captions.length - 1].text.endsWith(" ")) {
                    captions[captions.length - 1].text += record.text;
                    captions[captions.length - 1].endMs = record.offsets.to;
                    return;
                }
                captions.push({
                    text: token.text,
                    startMs: record.offsets.from,
                    endMs: record.offsets.to,
                });
            });
        });
        logger_1.logger.debug({ audioPath, captions }, "Captions created");
        return captions;
    }
}
exports.Whisper = Whisper;
