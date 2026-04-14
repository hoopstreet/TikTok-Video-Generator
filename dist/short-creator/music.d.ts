import { MusicForVideo } from "../types/shorts";
import { Config } from "../config";
export declare class MusicManager {
    private config;
    private static musicList;
    constructor(config: Config);
    musicList(): MusicForVideo[];
    private musicFileExist;
    ensureMusicFilesExist(): void;
}
