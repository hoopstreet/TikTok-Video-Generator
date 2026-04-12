import express from "express";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import axios from "axios";
import { logger } from "../../logger";

export class APIRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post("/short-video", async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        const runpodApiKey = process.env.RUNPOD_API_KEY;
        const endpointId = process.env.RUNPOD_ENDPOINT_ID;
        const response = await axios.post(
          `https://api.runpod.ai/v2/${endpointId}/run`,
          { input: req.body },
          { headers: { Authorization: `Bearer ${runpodApiKey}` } }
        );
        res.status(201).json({ videoId: response.data.id });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // CRITICAL FIX: The UI calls this to check status
    this.router.get("/video-status/:id", async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        const runpodApiKey = process.env.RUNPOD_API_KEY;
        const endpointId = process.env.RUNPOD_ENDPOINT_ID;
        const jobId = req.params.id;

        const response = await axios.get(
          `https://api.runpod.ai/v2/${endpointId}/status/${jobId}`,
          { headers: { Authorization: `Bearer ${runpodApiKey}` } }
        );

        const runpodStatus = response.data.status;
        
        // Map RunPod's actual state to what the UI expects
        if (runpodStatus === "COMPLETED") {
          return res.json({ status: "ready", url: response.data.output });
        } else if (runpodStatus === "FAILED") {
          return res.json({ status: "error" });
        } else {
          return res.json({ status: "processing" });
        }
      } catch (error) {
        res.json({ status: "processing" });
      }
    });
  }
}

export const restRouter = new APIRouter().router;
