import { Config } from "../../config";
import type { Caption } from "../../types/shorts";
export declare const ErrorWhisper: Error;
export declare class Whisper {
    private config;
    constructor(config: Config);
    static init(config: Config): Promise<Whisper>;
    CreateCaption(audioPath: string): Promise<Caption[]>;
}
