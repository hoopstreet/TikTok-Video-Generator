"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemotionRoot = exports.calculateMetadata = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const remotion_1 = require("remotion");
const PortraitVideo_1 = require("../videos/PortraitVideo");
const LandscapeVideo_1 = require("../videos/LandscapeVideo");
const Test_1 = require("../videos/Test");
const types_1 = require("../types");
const FPS = 25;
const calculateMetadata = async ({ props }) => {
    const durationInFrames = Math.floor((props.config.durationMs / 1000) * FPS);
    return {
        ...props,
        durationInFrames,
    };
};
exports.calculateMetadata = calculateMetadata;
const RemotionRoot = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(remotion_1.Composition, { id: types_1.AvailableComponentsEnum.PortraitVideo, component: PortraitVideo_1.PortraitVideo, durationInFrames: 30, fps: FPS, width: 1080, height: 1920, defaultProps: {
                    music: {
                        url: "http://localhost:3123/api/music/" +
                            encodeURIComponent("Aurora on the Boulevard - National Sweetheart.mp3"),
                        file: "mellow-smooth-rap-beat-20230107-132480.mp3",
                        start: 0,
                        end: 175,
                    },
                    scenes: [
                        {
                            captions: [
                                { text: " Hello", startMs: 390, endMs: 990 },
                                { text: " World.", startMs: 990, endMs: 2000 },
                            ],
                            video: "https://videos.pexels.com/video-files/4625747/4625747-hd_1080_1920_24fps.mp4",
                            audio: {
                                url: "http://localhost:3123/api/tmp/cma1lgean0001rlsi52b8h3n3.mp3",
                                duration: 3.15,
                            },
                        },
                    ],
                    config: {
                        durationMs: 4650,
                        paddingBack: 1500,
                        captionBackgroundColor: "blue",
                        captionPosition: "bottom",
                    },
                }, calculateMetadata: exports.calculateMetadata }), (0, jsx_runtime_1.jsx)(remotion_1.Composition, { id: types_1.AvailableComponentsEnum.LandscapeVideo, component: LandscapeVideo_1.LandscapeVideo, durationInFrames: 30, fps: FPS, width: 1920, height: 1080, defaultProps: {
                    music: {
                        url: "http://localhost:3123/api/music/" +
                            encodeURIComponent("Aurora on the Boulevard - National Sweetheart.mp3"),
                        file: "mellow-smooth-rap-beat-20230107-132480.mp3",
                        start: 0,
                        end: 175,
                    },
                    scenes: [
                        {
                            captions: [
                                {
                                    text: " A",
                                    startMs: 110,
                                    endMs: 320,
                                },
                                {
                                    text: " week",
                                    startMs: 320,
                                    endMs: 590,
                                },
                                {
                                    text: " ago,",
                                    startMs: 590,
                                    endMs: 1220,
                                },
                                {
                                    text: " a",
                                    startMs: 1220,
                                    endMs: 1280,
                                },
                                {
                                    text: " friend",
                                    startMs: 1280,
                                    endMs: 1490,
                                },
                                {
                                    text: " invited",
                                    startMs: 1490,
                                    endMs: 1820,
                                },
                                {
                                    text: " a",
                                    startMs: 1820,
                                    endMs: 1880,
                                },
                                {
                                    text: " couple",
                                    startMs: 1880,
                                    endMs: 2310,
                                },
                                {
                                    text: " of",
                                    startMs: 2310,
                                    endMs: 2350,
                                },
                                {
                                    text: " other",
                                    startMs: 2350,
                                    endMs: 2640,
                                },
                                {
                                    text: " couples",
                                    startMs: 2640,
                                    endMs: 3080,
                                },
                                {
                                    text: " over",
                                    startMs: 3080,
                                    endMs: 3400,
                                },
                                {
                                    text: " for",
                                    startMs: 3400,
                                    endMs: 3620,
                                },
                                {
                                    text: " dinner.",
                                    startMs: 3620,
                                    endMs: 4340,
                                },
                                {
                                    text: " Eventually,",
                                    startMs: 4340,
                                    endMs: 5520,
                                },
                                {
                                    text: " the",
                                    startMs: 5520,
                                    endMs: 5550,
                                },
                                {
                                    text: " food,",
                                    startMs: 5550,
                                    endMs: 6300,
                                },
                                {
                                    text: " but",
                                    startMs: 6300,
                                    endMs: 6360,
                                },
                                {
                                    text: " not",
                                    startMs: 6360,
                                    endMs: 6540,
                                },
                                {
                                    text: " the",
                                    startMs: 6540,
                                    endMs: 6780,
                                },
                                {
                                    text: " wine,",
                                    startMs: 6780,
                                    endMs: 7210,
                                },
                                {
                                    text: " was",
                                    startMs: 7210,
                                    endMs: 7400,
                                },
                                {
                                    text: " cleared",
                                    startMs: 7400,
                                    endMs: 7870,
                                },
                                {
                                    text: " off",
                                    startMs: 7870,
                                    endMs: 7980,
                                },
                                {
                                    text: " the",
                                    startMs: 7980,
                                    endMs: 8180,
                                },
                                {
                                    text: " table",
                                    startMs: 8180,
                                    endMs: 8480,
                                },
                                {
                                    text: " for",
                                    startMs: 8480,
                                    endMs: 8770,
                                },
                                {
                                    text: " what",
                                    startMs: 8770,
                                    endMs: 8880,
                                },
                                {
                                    text: " turned",
                                    startMs: 8880,
                                    endMs: 9230,
                                },
                                {
                                    text: " out",
                                    startMs: 9230,
                                    endMs: 9390,
                                },
                                {
                                    text: " to",
                                    startMs: 9390,
                                    endMs: 9510,
                                },
                                {
                                    text: " be",
                                    startMs: 9510,
                                    endMs: 9620,
                                },
                                {
                                    text: " some",
                                    startMs: 9620,
                                    endMs: 9850,
                                },
                                {
                                    text: " fierce",
                                    startMs: 9850,
                                    endMs: 10200,
                                },
                                {
                                    text: " scrabbling.",
                                    startMs: 10200,
                                    endMs: 11000,
                                },
                            ],
                            video: "https://videos.pexels.com/video-files/1168989/1168989-hd_1920_1080_30fps.mp4",
                            audio: {
                                url: "http://localhost:3123/api/tmp/cma9ctvpo0001aqsia12i82db.mp3",
                                duration: 12.8,
                            },
                        },
                    ],
                    config: {
                        durationMs: 14300,
                        paddingBack: 1500,
                        captionBackgroundColor: "#ff0000",
                        captionPosition: "center",
                    },
                }, calculateMetadata: exports.calculateMetadata }), (0, jsx_runtime_1.jsx)(remotion_1.Composition, { id: "TestVideo", component: Test_1.TestVideo, durationInFrames: 14, fps: 23, width: 100, height: 100 })] }));
};
exports.RemotionRoot = RemotionRoot;
