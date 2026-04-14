"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestVideo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const remotion_1 = require("remotion");
const TestVideo = () => {
    return ((0, jsx_runtime_1.jsx)(remotion_1.AbsoluteFill, { children: (0, jsx_runtime_1.jsxs)(remotion_1.AbsoluteFill, { children: [(0, jsx_runtime_1.jsx)(remotion_1.AbsoluteFill, { children: (0, jsx_runtime_1.jsx)("h1", { children: "Hello" }) }), (0, jsx_runtime_1.jsx)(remotion_1.Sequence, { from: 10, children: (0, jsx_runtime_1.jsx)("h1", { style: { marginTop: "60px" }, children: "World" }) })] }) }));
};
exports.TestVideo = TestVideo;
