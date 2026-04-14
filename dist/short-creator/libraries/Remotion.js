"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remotion = void 0;
const bundler_1 = require("@remotion/bundler");
const renderer_1 = require("@remotion/renderer");
const path_1 = __importDefault(require("path"));
const renderer_2 = require("@remotion/renderer");
const logger_1 = require("../../logger");
const utils_1 = require("../../components/utils");
class Remotion {
    bundled;
    config;
    constructor(bundled, config) {
        this.bundled = bundled;
        this.config = config;
    }
    static async init(config) {
        await (0, renderer_2.ensureBrowser)();
        const bundled = await (0, bundler_1.bundle)({
            entryPoint: path_1.default.join(config.packageDirPath, config.devMode ? "src" : "dist", "components", "root", `index.${config.devMode ? "ts" : "js"}`),
        });
        return new Remotion(bundled, config);
    }
    async render(data, id, orientation) {
        const { component } = (0, utils_1.getOrientationConfig)(orientation);
        const composition = await (0, renderer_1.selectComposition)({
            serveUrl: this.bundled,
            id: component,
            inputProps: data,
        });
        logger_1.logger.debug({ component, videoID: id }, "Rendering video with Remotion");
        const outputLocation = path_1.default.join(this.config.videosDirPath, `${id}.mp4`);
        await (0, renderer_1.renderMedia)({
            codec: "h264",
            composition,
            serveUrl: this.bundled,
            outputLocation,
            inputProps: data,
            onProgress: ({ progress }) => {
                logger_1.logger.debug(`Rendering ${id} ${Math.floor(progress * 100)}% complete`);
            },
            // preventing memory issues with docker
            concurrency: this.config.concurrency,
            offthreadVideoCacheSizeInBytes: this.config.videoCacheSizeInBytes,
        });
        logger_1.logger.debug({
            outputLocation,
            component,
            videoID: id,
        }, "Video rendered with Remotion");
    }
    async testRender(outputLocation) {
        const composition = await (0, renderer_1.selectComposition)({
            serveUrl: this.bundled,
            id: "TestVideo",
        });
        await (0, renderer_1.renderMedia)({
            codec: "h264",
            composition,
            serveUrl: this.bundled,
            outputLocation,
            onProgress: ({ progress }) => {
                logger_1.logger.debug(`Rendering test video: ${Math.floor(progress * 100)}% complete`);
            },
            // preventing memory issues with docker
            concurrency: this.config.concurrency,
            offthreadVideoCacheSizeInBytes: this.config.videoCacheSizeInBytes,
        });
    }
}
exports.Remotion = Remotion;
