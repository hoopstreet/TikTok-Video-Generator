export const startWebServer = (port: number) => {
  console.log("🔍 [Debug] Loading app module...");
  
  try {
    const app = require('./app').default || require('./app');
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
