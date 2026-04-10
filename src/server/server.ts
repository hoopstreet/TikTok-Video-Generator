import path from 'path';

export const startWebServer = (port: number) => {
  console.log("🔍 [Debug] Loading app module...");
  
  try {
    // We use path.join to ensure the path is absolute relative to this file
    const appPath = path.join(__dirname, 'app');
    const app = require(appPath).default || require(appPath);
    
    console.log("🔍 [Debug] App module loaded. Attempting to listen on port " + port);
    
    const server = app.listen(port, "0.0.0.0", () => {
      console.log("🚀 SUCCESS: TikTok Generator UI is live at http://0.0.0.0:" + port);
    });

    server.on('error', (err: any) => {
      console.error("❌ [Debug] Server Listen Error:", err);
    });
  } catch (error) {
    console.error("❌ [Debug] Crash during require('./app'):", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
