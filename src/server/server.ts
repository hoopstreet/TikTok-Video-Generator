import express from 'express';
import path from 'path';
import { Config } from '../config';
import { ShortCreator } from '../short-creator/ShortCreator';
import { APIRouter } from './routers/rest';

export const startWebServer = async (port: number) => {
  console.log("🏗️  Manually constructing Express app from routers...");
  
  try {
    const app = express();
    const config = new Config();
    const shortCreator = new ShortCreator(config);
    
    // Initialize your REST router
    const apiRouter = new APIRouter(config, shortCreator);
    
    // Attach the UI and the API
    app.use(express.json());
    app.use('/api', apiRouter.router);
    
    // Serve the static UI files from the dist/ui folder
    const uiPath = path.join(process.cwd(), 'dist', 'ui');
    app.use(express.static(uiPath));
    
    // Catch-all for React Router
    app.get('*', (req, res) => {
      res.sendFile(path.join(uiPath, 'index.html'));
    });

    app.listen(port, "0.0.0.0", () => {
      console.log("🚀 SUCCESS: TikTok Generator UI is LIVE at port " + port);
    });
  } catch (error) {
    console.error("❌ Construction Error:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
