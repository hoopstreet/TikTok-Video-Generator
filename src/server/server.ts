import express from 'express';
import path from 'path';
import { Config } from '../config';
import { ShortCreator } from '../short-creator/ShortCreator';
import { APIRouter } from './routers/rest';

export const startWebServer = async (port: number) => {
  console.log("🏗️  Assembling Express app with Error Tracking...");
  
  try {
    const app = express();
    const config = new Config();
    const shortCreator = new ShortCreator(config);
    const apiRouter = new APIRouter(config, shortCreator);
    
    app.use(express.json());

    // Logging middleware with Error Capture
    app.use((req, res, next) => {
      console.log(`📡 ${req.method} ${req.url}`);
      const oldJson = res.json;
      res.json = function(data) {
        if (res.statusCode >= 400) {
          console.error(`❌ API ERROR on ${req.url}:`, JSON.stringify(data));
        }
        return oldJson.call(this, data);
      };
      next();
    });

    app.use('/api', apiRouter.router);
    app.use('/', apiRouter.router);
    
    const uiPath = path.join(process.cwd(), 'dist', 'ui');
    app.use(express.static(uiPath));
    
    app.get('*', (req, res) => {
      if (req.url.startsWith('/api/') || req.url === '/voices' || req.url === '/music') {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(uiPath, 'index.html'));
    });

    app.listen(port, "0.0.0.0", () => {
      console.log("🚀 Server logic active on port " + port);
    });
  } catch (error) {
    console.error("❌ Fatal Assembly Error:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
