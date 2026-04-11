import express from 'express';
import path from 'path';
import { Config } from '../config';
import { ShortCreator } from '../short-creator/ShortCreator';
import { APIRouter } from './routers/rest';

export const startWebServer = async (port: number) => {
  console.log("🏗️  Assembling Express app with debug logging...");
  
  try {
    const app = express();
    const config = new Config();
    const shortCreator = new ShortCreator(config);
    const apiRouter = new APIRouter(config, shortCreator);
    
    app.use(express.json());

    // Debug Middleware: Log every request
    app.use((req, res, next) => {
      console.log(`📡 Incoming: ${req.method} ${req.url}`);
      next();
    });

    // Mount routers on both root and /api to ensure frontend finds them
    app.use('/api', apiRouter.router);
    app.use('/', apiRouter.router);
    
    const uiPath = path.join(process.cwd(), 'dist', 'ui');
    app.use(express.static(uiPath));
    
    app.get('*', (req, res) => {
      // Don't intercept API calls with index.html
      if (req.url.startsWith('/api/') || req.url === '/voices' || req.url === '/music') {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(uiPath, 'index.html'));
    });

    app.listen(port, "0.0.0.0", () => {
      console.log("🚀 Server logic active on port " + port);
    });
  } catch (error) {
    console.error("❌ Assembly Error:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
