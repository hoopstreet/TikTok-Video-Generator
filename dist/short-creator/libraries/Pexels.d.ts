import { OrientationEnum, type Video } from "../../types/shorts";
export declare class PexelsAPI {
    private API_KEY;
    constructor(API_KEY: string);
    private _findVideo;
    findVideo(searchTerms: string[], minDurationSeconds: number, excludeIds?: string[], orientation?: OrientationEnum, timeout?: number, retryCounter?: number): Promise<Video>;
}
