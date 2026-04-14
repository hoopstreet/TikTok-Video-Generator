"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runpodHandler = void 0;
const ShortCreator_1 = require("../short-creator/ShortCreator");
const Kokoro_1 = require("../short-creator/libraries/Kokoro");
const Whisper_1 = require("../short-creator/libraries/Whisper");
const PexelsModule = __importStar(require("../short-creator/libraries/Pexels"));
const Remotion_1 = require("../short-creator/libraries/Remotion");
const FFmpeg_1 = require("../short-creator/libraries/FFmpeg");
const music_1 = require("../short-creator/music");
const runpodHandler = async (event) => {
    const { input } = event;
    console.log("🎬 RunPod Worker received job:", input);
    try {
        const pexelsClass = PexelsModule.Pexels || PexelsModule;
        // 1. Prepare Configuration (typed as any to bypass strict checks)
        const config = {
            ...input,
            outputDir: process.env.DATA_DIR_PATH || '/app/data'
        };
        // 2. Initialize Sub-Libraries using your specific structure
        const remotion = new Remotion_1.Remotion("", {});
        const kokoro = new Kokoro_1.Kokoro(process.env.KOKORO_MODEL_PRECISION || 'fp16');
        const whisper = new Whisper_1.Whisper(process.env.WHISPER_MODEL || 'base.en');
        const ffmpeg = new FFmpeg_1.FFMpeg();
        const pexels = new pexelsClass(process.env.PEXELS_API_KEY || '');
        const musicManager = new music_1.MusicManager(config); // Uses the class from ../short-creator/music
        // 3. Initialize ShortCreator with the exact 7 arguments found in your grep
        const creator = new ShortCreator_1.ShortCreator(config, // 1. config
        remotion, // 2. remotion
        kokoro, // 3. kokoro
        whisper, // 4. whisper
        ffmpeg, // 5. ffmpeg
        pexels, // 6. pexelsApi
        musicManager // 7. musicManager
        );
        const result = await creator.createShort({
            ...input,
        }, { id: '"fish_ate_budol"', name: 'Ate (Fish: Realistic Taglish)', lang: 'fil-PH', engine: 'fish-speech' }, voice, input.voice || 'af_heart');
    }
    finally { }
    ;
    return {
        status: "success",
        videoUrl: result.url || result
    };
};
exports.runpodHandler = runpodHandler;
try { }
catch (error) {
    console.error("❌ Generation Failed:", error);
    return { status: "error", message: error.message };
}
;
