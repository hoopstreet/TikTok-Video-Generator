import "dotenv/config";
import pino from "pino";
import { kokoroModelPrecision, whisperModels } from "./types/shorts";
export declare const logger: any;
export declare class Config {
    private dataDirPath;
    private libsDirPath;
    private staticDirPath;
    installationSuccessfulPath: string;
    whisperInstallPath: string;
    videosDirPath: string;
    tempDirPath: string;
    packageDirPath: string;
    musicDirPath: string;
    pexelsApiKey: string;
    logLevel: pino.Level;
    whisperVerbose: boolean;
    port: number;
    runningInDocker: boolean;
    devMode: boolean;
    whisperVersion: string;
    whisperModel: whisperModels;
    kokoroModelPrecision: kokoroModelPrecision;
    concurrency?: number;
    videoCacheSizeInBytes: number | null;
    constructor();
    ensureConfig(): void;
}
export declare const KOKORO_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";
