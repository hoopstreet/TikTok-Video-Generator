import express from "express";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import fs from "fs-extra";
import path from "path";

import { validateCreateShortInput, validateQuestionVideoInput } from "../validator";
import { ShortCreator } from "../../short-creator/ShortCreator";
import { logger } from "../../logger";
import { Config } from "../../config";

// todo abstract class
export class APIRouter {
  public router: express.Router;
  private shortCreator: ShortCreator;
  private config: Config;

  constructor(config: Config, shortCreator: ShortCreator) {
    this.config = config;
    this.router = express.Router();
    this.shortCreator = shortCreator;

    this.router.use(express.json());

    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/short-video",
      async (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const input = validateCreateShortInput(req.body);

          logger.info({ input }, "Creating short video");

          const videoId = this.shortCreator.addToQueue(
            input.scenes,
            input.config,
          );

          res.status(201).json({
            videoId,
          });
        } catch (error: unknown) {
          logger.error(error, "Error validating input");

          // Handle validation errors specifically
          if (error instanceof Error && error.message.startsWith("{")) {
            try {
              const errorData = JSON.parse(error.message);
              res.status(400).json({
                error: "Validation failed",
                message: errorData.message,
                missingFields: errorData.missingFields,
              });
              return;
            } catch (parseError: unknown) {
              logger.error(parseError, "Error parsing validation error");
            }
          }

          // Fallback for other errors
          res.status(400).json({
            error: "Invalid input",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },
    );

    this.router.get(
      "/short-video/:videoId/status",
      async (req: ExpressRequest, res: ExpressResponse) => {
        const { videoId } = req.params;
        if (!videoId) {
          res.status(400).json({
            error: "videoId is required",
          });
          return;
        }
        const status = this.shortCreator.status(videoId);
        res.status(200).json({
          status,
        });
      },
    );

    this.router.get(
      "/music-tags",
      (req: ExpressRequest, res: ExpressResponse) => {
        res.status(200).json(this.shortCreator.ListAvailableMusicTags());
      },
    );

    this.router.get("/voices", (req: ExpressRequest, res: ExpressResponse) => {
      res.status(200).json(this.shortCreator.ListAvailableVoices());
    });

    this.router.get("/music-list", (req: ExpressRequest, res: ExpressResponse) => {
      res.status(200).json(this.shortCreator.ListSortedMusic());
    });

    this.router.post(
      "/question-video",
      async (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const input = validateQuestionVideoInput(req.body);

          logger.info({ input }, "Creating question video");

          const videoId = this.shortCreator.addQuestionVideoToQueue(input);

          res.status(201).json({
            videoId,
          });
        } catch (error: unknown) {
          logger.error(error, "Error validating question video input");

          // Handle validation errors specifically
          if (error instanceof Error && error.message.startsWith("{")) {
            try {
              const errorData = JSON.parse(error.message);
              res.status(400).json({
                error: "Validation failed",
                message: errorData.message,
                missingFields: errorData.missingFields,
              });
              return;
            } catch (parseError: unknown) {
              logger.error(parseError, "Error parsing validation error");
            }
          }

          // Fallback for other errors
          res.status(400).json({
            error: "Invalid input",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },
    );

    this.router.get(
      "/short-videos",
      (req: ExpressRequest, res: ExpressResponse) => {
        const videos = this.shortCreator.listAllVideos();
        res.status(200).json({
          videos,
        });
      },
    );

    this.router.delete(
      "/short-video/:videoId",
      (req: ExpressRequest, res: ExpressResponse) => {
        const { videoId } = req.params;
        if (!videoId) {
          res.status(400).json({
            error: "videoId is required",
          });
          return;
        }
        this.shortCreator.deleteVideo(videoId);
        res.status(200).json({
          success: true,
        });
      },
    );

    this.router.get(
      "/tmp/:tmpFile",
      (req: ExpressRequest, res: ExpressResponse) => {
        const { tmpFile } = req.params;
        if (!tmpFile) {
          res.status(400).json({
            error: "tmpFile is required",
          });
          return;
        }
        const tmpFilePath = path.join(this.config.tempDirPath, tmpFile);
        if (!fs.existsSync(tmpFilePath)) {
          res.status(404).json({
            error: "tmpFile not found",
          });
          return;
        }

        if (tmpFile.endsWith(".mp3")) {
          res.setHeader("Content-Type", "audio/mpeg");
        }
        if (tmpFile.endsWith(".wav")) {
          res.setHeader("Content-Type", "audio/wav");
        }
        if (tmpFile.endsWith(".mp4")) {
          res.setHeader("Content-Type", "video/mp4");
        }

        const tmpFileStream = fs.createReadStream(tmpFilePath);
        tmpFileStream.on("error", (error) => {
          logger.error(error, "Error reading tmp file");
          res.status(500).json({
            error: "Error reading tmp file",
            tmpFile,
          });
        });
        tmpFileStream.pipe(res);
      },
    );

    this.router.get(
      "/music/:fileName",
      (req: ExpressRequest, res: ExpressResponse) => {
        const { fileName } = req.params;
        if (!fileName) {
          res.status(400).json({
            error: "fileName is required",
          });
          return;
        }
        const musicFilePath = path.join(this.config.musicDirPath, fileName);
        if (!fs.existsSync(musicFilePath)) {
          res.status(404).json({
            error: "music file not found",
          });
          return;
        }
        const musicFileStream = fs.createReadStream(musicFilePath);
        musicFileStream.on("error", (error) => {
          logger.error(error, "Error reading music file");
          res.status(500).json({
            error: "Error reading music file",
            fileName,
          });
        });
        musicFileStream.pipe(res);
      },
    );

    this.router.get(
      "/sfx/:fileName",
      (req: ExpressRequest, res: ExpressResponse) => {
        const { fileName } = req.params;
        if (!fileName) {
          res.status(400).json({
            error: "fileName is required",
          });
          return;
        }
        const sfxFilePath = path.join(this.config.sfxDirPath, fileName);
        if (!fs.existsSync(sfxFilePath)) {
          res.status(404).json({
            error: "sfx file not found",
          });
          return;
        }
        const sfxFileStream = fs.createReadStream(sfxFilePath);
        sfxFileStream.on("error", (error) => {
          logger.error(error, "Error reading sfx file");
          res.status(500).json({
            error: "Error reading sfx file",
            fileName,
          });
        });
        sfxFileStream.pipe(res);
      },
    );

    this.router.get(
      "/short-video/:videoId",
      (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const { videoId } = req.params;
          if (!videoId) {
            res.status(400).json({
              error: "videoId is required",
            });
            return;
          }
          const video = this.shortCreator.getVideo(videoId);
          res.setHeader("Content-Type", "video/mp4");
          res.setHeader(
            "Content-Disposition",
            `inline; filename=${videoId}.mp4`,
          );
          res.send(video);
        } catch (error: unknown) {
          logger.error(error, "Error getting video");
          res.status(404).json({
            error: "Video not found",
          });
        }
      },
    );

    // Test endpoints
    this.router.post("/test/image", async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        const { prompt } = req.body as { prompt: string };
        if (!prompt) {
          res.status(400).json({ error: "prompt is required" });
          return;
        }
        const { tmpFile } = await this.shortCreator.testGenerateImage(prompt);
        res.status(200).json({ tmpFile, url: `/api/tmp/${tmpFile}` });
      } catch (error) {
        logger.error(error, "Error in /test/image");
        res.status(500).json({ error: "image test failed" });
      }
    });

    this.router.post("/test/tts", async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        const { text, voice } = req.body as { text: string; voice?: string };
        if (!text) {
          res.status(400).json({ error: "text is required" });
          return;
        }
        const { tmpMp3, duration } = await this.shortCreator.testGenerateTTS(text, voice);
        res.status(200).json({ tmpMp3, duration, url: `/api/tmp/${tmpMp3}` });
      } catch (error) {
        logger.error(error, "Error in /test/tts");
        res.status(500).json({ error: "tts test failed" });
      }
    });

    this.router.post("/test/assemble", async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        const { imageTmpFile, durationSeconds } = req.body as { imageTmpFile: string; durationSeconds: number };
        if (!imageTmpFile || !durationSeconds) {
          res.status(400).json({ error: "imageTmpFile and durationSeconds are required" });
          return;
        }
        const { tmpVideo } = await this.shortCreator.testAssembleImageAndAudio(imageTmpFile, durationSeconds);
        res.status(200).json({ tmpVideo, url: `/api/tmp/${tmpVideo}` });
      } catch (error) {
        logger.error(error, "Error in /test/assemble");
        res.status(500).json({ error: "assemble test failed" });
      }
    });

    // ElevenLabs TTS Test Endpoint
    this.router.post("/test/elevenlabs", async (req: ExpressRequest, res: ExpressResponse) => {
      try {
        const { text, voiceId } = req.body as { 
          text?: string; 
          voiceId?: string; 
        };
        
        const testText = text || "Merhaba! Bu ses ElevenLabs v3 modeli ile oluşturuldu. Türkçe konuşma sentezi test ediliyor.";
        const testVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID || "5IRSuKNUc0nJnSPPuxMI";
        
        logger.info({ text: testText, voiceId: testVoiceId }, "Testing ElevenLabs TTS");
        
        const { tmpMp3, duration } = await this.shortCreator.testElevenLabsTTS(testText, testVoiceId);
        
        res.status(200).json({ 
          tmpMp3, 
          duration, 
          url: `/api/tmp/${tmpMp3}`,
          text: testText,
          voiceId: testVoiceId,
          model: "eleven_v3"
        });
      } catch (error) {
        logger.error(error, "Error in /test/elevenlabs");
        res.status(500).json({ error: "ElevenLabs TTS test failed", details: error instanceof Error ? error.message : String(error) });
      }
    });
  }
}
