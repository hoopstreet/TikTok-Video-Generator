import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { Config } from '../config';
import { ShortCreator } from '../short-creator/ShortCreator';
import { APIRouter } from './routers/rest';

import { Kokoro } from '../short-creator/libraries/Kokoro';
import { Whisper } from '../short-creator/libraries/Whisper';
import { Remotion } from '../short-creator/libraries/Remotion';
import { PexelsAPI } from '../short-creator/libraries/Pexels'; 
import { FFMpeg } from '../short-creator/libraries/FFmpeg'; 
import { MusicManager } from '../short-creator/music'; 

export const startWebServer = async (port: number) => {
  console.log("🏗️  Assembling Full AI Pipeline...");
  const config = new Config();
  
  if (!config.dataDirPath) {
     (config as any).dataDirPath = path.join(process.cwd(), 'data');
     (config as any).videosDirPath = path.join((config as any).dataDirPath, 'videos');
  }

  [config.dataDirPath, config.videosDirPath, 'temp'].forEach(dir => {
    if (dir) fs.ensureDirSync(dir);
  });

  try {
    const shortCreator = new ShortCreator(
      config,
      new Remotion("" as any, {} as any),
      new Kokoro('fp16' as any),
      new Whisper('base.en'),
      new FFMpeg(),
      new PexelsAPI(process.env.PEXELS_API_KEY || ''),
      new MusicManager(config)
    );

    const apiRouter = new APIRouter(config, shortCreator);
    const app = express();
    app.use(express.json());

    app.use('/api', apiRouter.router);
    app.use('/', apiRouter.router);
    
    // FLEXIBLE UI PATHING
    const possibleUiPaths = [
      path.join(process.cwd(), 'dist', 'ui'),
      path.join(process.cwd(), 'dist'),
      path.join(process.cwd(), 'public')
    ];

    const uiPath = possibleUiPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || possibleUiPaths[0];
    console.log(`🌐 Serving UI from: ${uiPath}`);
    
    app.use(express.static(uiPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(uiPath, 'index.html');
      if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
      res.status(404).send("Frontend build not found. Check Hugging Face build logs.");
    });

    app.listen(port, "0.0.0.0", () => {
      console.log("🚀 Server fully operational on port " + port);
    });
  } catch (error) {
    console.error("❌ Fatal Assembly Error:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
