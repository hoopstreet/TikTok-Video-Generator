import express from "express";
import axios from "axios";

export const restRouter = express.Router();

restRouter.post("/short-video", async (req, res) => {
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
  const response = await axios.get(
    `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/status/${req.params.id}`,
    { headers: { Authorization: `Bearer ${process.env.RUNPOD_API_KEY}` } }
  );
  res.json({ 
    status: response.data.status === "COMPLETED" ? "ready" : "processing",
    url: response.data.output 
  });
});
