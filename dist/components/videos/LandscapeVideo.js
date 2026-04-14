"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandscapeVideo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const remotion_1 = require("remotion");
const BarlowCondensed_1 = require("@remotion/google-fonts/BarlowCondensed");
const utils_1 = require("../utils");
const { fontFamily } = (0, BarlowCondensed_1.loadFont)(); // "Barlow Condensed"
const LandscapeVideo = ({ scenes, music, config, }) => {
    const frame = (0, remotion_1.useCurrentFrame)();
    const { fps } = (0, remotion_1.useVideoConfig)();
    const captionBackgroundColor = config.captionBackgroundColor ?? "blue";
    const activeStyle = {
        backgroundColor: captionBackgroundColor,
        padding: "10px",
        marginLeft: "-10px",
        marginRight: "-10px",
        borderRadius: "10px",
    };
    const captionPosition = config.captionPosition ?? "center";
    let captionStyle = {};
    if (captionPosition === "top") {
        captionStyle = { top: 100 };
    }
    if (captionPosition === "center") {
        captionStyle = { top: "50%", transform: "translateY(-50%)" };
    }
    if (captionPosition === "bottom") {
        captionStyle = { bottom: 100 };
    }
    const [musicVolume, musicMuted] = (0, utils_1.calculateVolume)(config.musicVolume);
    return ((0, jsx_runtime_1.jsxs)(remotion_1.AbsoluteFill, { style: { backgroundColor: "white" }, children: [(0, jsx_runtime_1.jsx)(remotion_1.Audio, { loop: true, src: music.url, startFrom: music.start * fps, endAt: music.end * fps, volume: () => musicVolume, muted: musicMuted }), scenes.map((scene, i) => {
                const { captions, audio, video } = scene;
                const pages = (0, utils_1.createCaptionPages)({
                    captions,
                    lineMaxLength: 30,
                    lineCount: 1,
                    maxDistanceMs: 1000,
                });
                // Calculate the start and end time of the scene
                const startFrame = scenes.slice(0, i).reduce((acc, curr) => {
                    return acc + curr.audio.duration;
                }, 0) * fps;
                let durationInFrames = scenes.slice(0, i + 1).reduce((acc, curr) => {
                    return acc + curr.audio.duration;
                }, 0) * fps;
                if (config.paddingBack && i === scenes.length - 1) {
                    durationInFrames += (config.paddingBack / 1000) * fps;
                }
                return ((0, jsx_runtime_1.jsxs)(remotion_1.Sequence, { from: startFrame, durationInFrames: durationInFrames, children: [(0, jsx_runtime_1.jsx)(remotion_1.OffthreadVideo, { src: video, muted: true }), (0, jsx_runtime_1.jsx)(remotion_1.Audio, { src: audio.url }), pages.map((page, j) => {
                            return ((0, jsx_runtime_1.jsx)(remotion_1.Sequence, { from: Math.round((page.startMs / 1000) * fps), durationInFrames: Math.round(((page.endMs - page.startMs) / 1000) * fps), children: (0, jsx_runtime_1.jsx)("div", { style: {
                                        position: "absolute",
                                        left: 0,
                                        width: "100%",
                                        ...captionStyle,
                                    }, children: page.lines.map((line, k) => {
                                        return ((0, jsx_runtime_1.jsx)("p", { style: {
                                                fontSize: "8em",
                                                fontFamily: fontFamily,
                                                fontWeight: "black",
                                                color: "white",
                                                WebkitTextStroke: "2px black",
                                                WebkitTextFillColor: "white",
                                                textShadow: "0px 0px 10px black",
                                                textAlign: "center",
                                                width: "100%",
                                                // uppercase
                                                textTransform: "uppercase",
                                            }, children: line.texts.map((text, l) => {
                                                const active = frame >=
                                                    startFrame + (text.startMs / 1000) * fps &&
                                                    frame <= startFrame + (text.endMs / 1000) * fps;
                                                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                                fontWeight: "bold",
                                                                ...(active ? activeStyle : {}),
                                                            }, children: text.text }, `scene-${i}-page-${j}-line-${k}-text-${l}`), l < line.texts.length - 1 ? " " : ""] }));
                                            }) }, `scene-${i}-page-${j}-line-${k}`));
                                    }) }) }, `scene-${i}-page-${j}`));
                        })] }, `scene-${i}`));
            })] }));
};
exports.LandscapeVideo = LandscapeVideo;
