import { type Caption, type OrientationEnum, MusicVolumeEnum } from "../types/shorts";
import { type OrientationConfig } from "./types";
export declare const shortVideoSchema: any;
export declare function createCaptionPages({ captions, lineMaxLength, lineCount, maxDistanceMs, }: {
    captions: Caption[];
    lineMaxLength: number;
    lineCount: number;
    maxDistanceMs: number;
}): never[];
export declare function getOrientationConfig(orientation: OrientationEnum): OrientationConfig;
export declare function calculateVolume(level?: MusicVolumeEnum): [number, boolean];
