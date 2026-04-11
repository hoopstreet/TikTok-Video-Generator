import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { Config } from '../config';
import { ShortCreator } from '../short-creator/ShortCreator';
import { APIRouter } from './routers/rest';

// Verified Paths
import { Kokoro } from '../short-creator/libraries/Kokoro';
import { Whisper } from '../short-creator/libraries/Whisper';
import { Remotion } from '../short-creator/libraries/Remotion';
import { PexelsAPI } from '../short-creator/libraries/Pexels'; 

// Guessed Paths - update these if the 'find' command above shows different results
import { FFMpeg } from '../short-creator/libraries/ffmpeg'; 
import { MusicManager } from '../short-creator/music/MusicManager'; 

export const startWebServer = async (port: number) => {
  console.log("🏗️  Assembling Full AI Pipeline...");
  
  const config = new Config();
  
  // FORCE a local data directory if none is provided to avoid permission issues
  if (!config.dataDirPath || config.dataDirPath === '') {
     (config as any).dataDirPath = path.join(process.cwd(), 'data');
     (config as any).videosDirPath = path.join((config as any).dataDirPath, 'videos');
  }

  // Ensure directories exist
  [config.dataDirPath, config.videosDirPath, 'temp'].forEach(dir => {
    if (dir) {
      console.log(`📂 Ensuring directory exists: ${dir}`);
      fs.ensureDirSync(dir);
    }
  });

  try {
    const remotion = new Remotion("" as any, {} as any); 
    const kokoro = new Kokoro('fp16' as any);
    const whisper = new Whisper('base.en');
    const ffmpeg = new FFMpeg();
    const pexels = new PexelsAPI(process.env.PEXELS_API_KEY || '');
    const musicManager = new MusicManager(config);

    const shortCreator = new ShortCreator(
      config,
      remotion,
      kokoro,
      whisper,
      ffmpeg,
      pexels,
      musicManager
    );

    const apiRouter = new APIRouter(config, shortCreator);
    const app = express();
    
    app.use(express.json());

    // Debug Logger
    app.use((req, res, next) => {
      console.log(`📡 ${req.method} ${req.url}`);
      next();
    });

    app.use('/api', apiRouter.router);
    app.use('/', apiRouter.router);
    
    const uiPath = path.join(process.cwd(), 'dist', 'ui');
    if (fs.existsSync(uiPath)) {
        app.use(express.static(uiPath));
        app.get('*', (req, res) => res.sendFile(path.join(uiPath, 'index.html')));
    }

    app.listen(port, "0.0.0.0", () => {
      console.log("🚀 Server fully operational on port " + port);
    });
  } catch (error) {
    console.error("❌ Fatal Assembly Error:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
