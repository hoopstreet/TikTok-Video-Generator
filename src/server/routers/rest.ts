import express from "express";
import axios from "axios";

export const restRouter = express.Router();

restRouter.post("/short-video", async (req, res) => {
  try {
    const { text, voiceId, engine, emotion } = req.body;
    let payload = {};

    // 1. Route to Fish Speech
    if (engine === 'fish-speech') {
      payload = {
        input: {
          text: `[${emotion || 'excited'}] ${text}`,
          model: "s2-pro",
          voice_engine: "fish-speech",
          voiceId: voiceId || "fish-ate-budol"
        }
      };
    } 
    // 2. Route to Kokoro
    else if (engine === 'kokoro') {
      payload = {
        input: {
          model: "kokoro",
          input: text,
          voice: voiceId || "af_bella",
          speed: 1.0
        }
      };
    }
    // 3. Default / Fallback
    else {
      payload = { input: req.body };
    }

    const response = await axios.post(
      `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/run`,
      payload,
      { headers: { Authorization: `Bearer ${process.env.RUNPOD_API_KEY}` } }
    );

    res.status(201).json({ videoId: response.data.id });
  } catch (error) {
    console.error("Routing Error:", error);
    res.status(500).json({ error: "Failed to reach RunPod backend" });
  }
});

restRouter.get("/video-status/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/status/${req.params.id}`,
      { headers: { Authorization: `Bearer ${process.env.RUNPOD_API_KEY}` } }
    );
    res.json({ 
      status: response.data.status === "COMPLETED" ? "ready" : "processing",
      url: response.data.output 
    });
  } catch (error) {
    res.json({ status: "processing" });
  }
});
