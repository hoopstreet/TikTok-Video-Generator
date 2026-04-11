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

        if (!runpodApiKey || !endpointId) {
          throw new Error("Missing RunPod configuration in Environment Variables");
        }

        logger.info("📡 Forwarding manual request from HF UI to RunPod...");

        // Forward request to RunPod Serverless
        const response = await axios.post(
          `https://api.runpod.ai/v2/${endpointId}/run`,
          { input: req.body },
          { headers: { Authorization: `Bearer ${runpodApiKey}` } }
        );

        res.status(201).json(response.data);
      } catch (error: any) {
        logger.error(error.message, "RunPod Forwarding Error");
        res.status(500).json({ error: error.message });
      }
    });
  }
}

export const restRouter = new APIRouter().router;
