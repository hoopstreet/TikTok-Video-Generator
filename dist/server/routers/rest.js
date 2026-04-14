"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restRouter = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
exports.restRouter = express_1.default.Router();
exports.restRouter.post("/short-video", async (req, res) => {
    try {
        const { text, voiceId, engine, emotion } = req.body;
        let payload = {
            input: {
                text: text,
                voiceId: voiceId,
                engine: engine || 'kokoro' // Default for backward compatibility
            }
        };
        // Auto-format for Fish Speech logic
        if (engine === 'fish-speech') {
            payload.input.text = `[${emotion || 'excited'}] ${text}`;
            payload.input.model = "s2-pro";
        }
        const response = await axios_1.default.post(`https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/run`, payload, { headers: { Authorization: `Bearer ${process.env.RUNPOD_API_KEY}` } });
        res.status(201).json({ videoId: response.data.id });
    }
    catch (error) {
        console.error("Routing Error:", error);
        res.status(500).json({ error: "Failed to reach RunPod backend" });
    }
});
exports.restRouter.get("/video-status/:id", async (req, res) => {
    const response = await axios_1.default.get(`https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/status/${req.params.id}`, { headers: { Authorization: `Bearer ${process.env.RUNPOD_API_KEY}` } });
    res.json({
        status: response.data.status === "COMPLETED" ? "ready" : "processing",
        url: response.data.output
    });
});
// Build Trigger: Sun Apr 12 14:38:11 UTC 2026
