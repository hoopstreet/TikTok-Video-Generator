"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KOKORO_MODEL = exports.Config = exports.logger = void 0;
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const pino_1 = __importDefault(require("pino"));
const defaultLogLevel = "info";
const defaultPort = 3123;
const whisperVersion = "1.7.1";
const defaultWhisperModel = "base.en"; // possible options: "tiny", "tiny.en", "base", "base.en", "small", "small.en", "medium", "base.en", "large-v1", "large-v2", "large-v3", "large-v3-turbo"
// Create the global logger
const versionNumber = process.env.npm_package_version;
exports.logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || defaultLogLevel,
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    base: {
        pid: process.pid,
        version: versionNumber,
    },
});
class Config {
    dataDirPath;
    libsDirPath;
    staticDirPath;
    installationSuccessfulPath;
    whisperInstallPath;
    videosDirPath;
    tempDirPath;
    packageDirPath;
    musicDirPath;
    pexelsApiKey;
    logLevel;
    whisperVerbose;
    port;
    runningInDocker;
    devMode;
    whisperVersion = whisperVersion;
    whisperModel = defaultWhisperModel;
    kokoroModelPrecision = "fp16";
    // docker-specific, performance-related settings to prevent memory issues
    concurrency;
    videoCacheSizeInBytes = null;
    constructor() {
        this.dataDirPath =
            process.env.DATA_DIR_PATH ||
                path_1.default.join(os_1.default.homedir(), ".ai-agents-az-video-generator");
        this.libsDirPath = path_1.default.join(this.dataDirPath, "libs");
        this.whisperInstallPath = path_1.default.join(this.libsDirPath, "whisper");
        this.videosDirPath = path_1.default.join(this.dataDirPath, "videos");
        this.tempDirPath = path_1.default.join(this.dataDirPath, "temp");
        this.installationSuccessfulPath = path_1.default.join(this.dataDirPath, "installation-successful");
        fs_extra_1.default.ensureDirSync(this.dataDirPath);
        fs_extra_1.default.ensureDirSync(this.libsDirPath);
        fs_extra_1.default.ensureDirSync(this.videosDirPath);
        fs_extra_1.default.ensureDirSync(this.tempDirPath);
        this.packageDirPath = path_1.default.join(__dirname, "..");
        this.staticDirPath = path_1.default.join(this.packageDirPath, "static");
        this.musicDirPath = path_1.default.join(this.staticDirPath, "music");
        this.pexelsApiKey = process.env.PEXELS_API_KEY;
        this.logLevel = (process.env.LOG_LEVEL || defaultLogLevel);
        this.whisperVerbose = process.env.WHISPER_VERBOSE === "true";
        this.port = process.env.PORT ? parseInt(process.env.PORT) : defaultPort;
        this.runningInDocker = process.env.DOCKER === "true";
        this.devMode = process.env.DEV === "true";
        if (process.env.WHISPER_MODEL) {
            this.whisperModel = process.env.WHISPER_MODEL;
        }
        if (process.env.KOKORO_MODEL_PRECISION) {
            this.kokoroModelPrecision = process.env
                .KOKORO_MODEL_PRECISION;
        }
        this.concurrency = process.env.CONCURRENCY
            ? parseInt(process.env.CONCURRENCY)
            : undefined;
        if (process.env.VIDEO_CACHE_SIZE_IN_BYTES) {
            this.videoCacheSizeInBytes = parseInt(process.env.VIDEO_CACHE_SIZE_IN_BYTES);
        }
    }
    ensureConfig() {
        if (!this.pexelsApiKey) {
            throw new Error("PEXELS_API_KEY environment variable is missing. Get your free API key: https://www.pexels.com/api/key/ - see how to run the project: https://github.com/gyoridavid/short-video-maker");
        }
    }
}
exports.Config = Config;
exports.KOKORO_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";
