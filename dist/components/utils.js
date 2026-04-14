"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortVideoSchema = void 0;
exports.createCaptionPages = createCaptionPages;
exports.getOrientationConfig = getOrientationConfig;
exports.calculateVolume = calculateVolume;
const zod_1 = require("zod");
const shorts_1 = require("../types/shorts");
const types_1 = require("./types");
exports.shortVideoSchema = zod_1.z.object({
    scenes: zod_1.z.array(zod_1.z.object({
        captions: zod_1.z.custom(),
        audio: zod_1.z.object({
            url: zod_1.z.string(),
            duration: zod_1.z.number(),
        }),
        video: zod_1.z.string(),
    })),
    config: zod_1.z.object({
        paddingBack: zod_1.z.number().optional(),
        captionPosition: zod_1.z.enum(["top", "center", "bottom"]).optional(),
        captionBackgroundColor: zod_1.z.string().optional(),
        durationMs: zod_1.z.number(),
        musicVolume: zod_1.z.nativeEnum(shorts_1.MusicVolumeEnum).optional(),
    }),
    music: zod_1.z.object({
        file: zod_1.z.string(),
        url: zod_1.z.string(),
        start: zod_1.z.number(),
        end: zod_1.z.number(),
    }),
});
function createCaptionPages({ captions, lineMaxLength, lineCount, maxDistanceMs, }) {
    const pages = [];
    let currentPage = {
        startMs: 0,
        endMs: 0,
        lines: [],
    };
    let currentLine = {
        texts: [],
    };
    captions.forEach((caption, i) => {
        // Check if we need to start a new page due to time gap
        if (i > 0 && caption.startMs - currentPage.endMs > maxDistanceMs) {
            // Add current line if not empty
            if (currentLine.texts.length > 0) {
                currentPage.lines.push(currentLine);
            }
            // Add current page if not empty
            if (currentPage.lines.length > 0) {
                pages.push(currentPage);
            }
            // Start new page
            currentPage = {
                startMs: caption.startMs,
                endMs: caption.endMs,
                lines: [],
            };
            currentLine = {
                texts: [],
            };
        }
        // Check if adding this caption exceeds the line length
        const currentLineText = currentLine.texts.map((t) => t.text).join(" ");
        if (currentLine.texts.length > 0 &&
            currentLineText.length + 1 + caption.text.length > lineMaxLength) {
            // Line is full, add it to current page
            currentPage.lines.push(currentLine);
            currentLine = {
                texts: [],
            };
            // Check if page is full
            if (currentPage.lines.length >= lineCount) {
                // Page is full, add it to pages
                pages.push(currentPage);
                // Start new page
                currentPage = {
                    startMs: caption.startMs,
                    endMs: caption.endMs,
                    lines: [],
                };
            }
        }
        // Add caption to current line
        currentLine.texts.push({
            text: caption.text,
            startMs: caption.startMs,
            endMs: caption.endMs,
        });
        // Update page timing
        currentPage.endMs = caption.endMs;
        if (i === 0 || currentPage.startMs === 0) {
            currentPage.startMs = caption.startMs;
        }
        else {
            currentPage.startMs = Math.min(currentPage.startMs, caption.startMs);
        }
    });
    // Don't forget to add the last line and page
    if (currentLine.texts.length > 0) {
        currentPage.lines.push(currentLine);
    }
    if (currentPage.lines.length > 0) {
        pages.push(currentPage);
    }
    return pages;
}
function getOrientationConfig(orientation) {
    const config = {
        portrait: {
            width: 1080,
            height: 1920,
            component: types_1.AvailableComponentsEnum.PortraitVideo,
        },
        landscape: {
            width: 1920,
            height: 1080,
            component: types_1.AvailableComponentsEnum.LandscapeVideo,
        },
    };
    return config[orientation];
}
function calculateVolume(level = shorts_1.MusicVolumeEnum.high) {
    switch (level) {
        case "muted":
            return [0, true];
        case "low":
            return [0.2, false];
        case "medium":
            return [0.45, false];
        case "high":
            return [0.7, false];
        default:
            return [0.7, false];
    }
}
