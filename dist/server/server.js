"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWebServer = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const rest_1 = require("./routers/rest");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const uiPath = path_1.default.join(process.cwd(), "dist/ui");
// 1. Serve UI
app.use(express_1.default.static(uiPath));
// 2. Connect the Proxy Router
app.use("/api", rest_1.restRouter);
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        mode: "proxy-to-runpod",
        endpoint: process.env.RUNPOD_ENDPOINT_ID ? "configured" : "missing"
    });
});
app.get("*", (req, res) => {
    const indexPath = path_1.default.join(uiPath, "index.html");
    if (fs_1.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
        res.status(404).send("UI build missing.");
    }
});
const startWebServer = (port) => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 Proxy Server active on port ${port}`);
    });
};
exports.startWebServer = startWebServer;
