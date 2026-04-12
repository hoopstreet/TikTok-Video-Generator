import express from "express";
import axios from "axios";

export const restRouter = express.Router();

restRouter.post("/short-video", async (req, res) => {
  try {
    const { text, voiceId, emotion } = req.body;
    
    // Auto-formatting for Taglish Affiliate energy
    const fishPrompt = `[${emotion || 'excited'}] ${text}`;

    const response = await axios.post(
      `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/run`,
      { 
        input: {
          ...req.body,
          text: fishPrompt,
          model: "s2-pro",
          voice_engine: "fish-speech"
        } 
      },
      { headers: { Authorization: `Bearer ${process.env.RUNPOD_API_KEY}` } }
    );
    res.status(201).json({ videoId: response.data.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to reach RunPod" });
  }
});

restRouter.get("/video-status/:id", async (req, res) => {
  const response = await axios.get(
    `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/status/${req.params.id}`,
    { headers: { Authorization: `Bearer ${process.env.RUNPOD_API_KEY}` } }
  );
  res.json({ 
    status: response.data.status === "COMPLETED" ? "ready" : "processing",
    url: response.data.output 
  });
});
