import path from 'path';
import fs from 'fs';

export const startWebServer = (port: number) => {
  console.log("🔍 [Debug] Loading app module...");
  
  try {
    const possiblePaths = [
      path.join(__dirname, 'app.js'),      // Same folder
      path.join(__dirname, '..', 'app.js'), // One level up (root of dist)
      path.join(process.cwd(), 'dist', 'app.js') // Absolute project dist root
    ];

    let app;
    let foundPath = "";

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        console.log("✅ Found app module at: " + p);
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      throw new Error("Could not locate app.js in any of: " + possiblePaths.join(', '));
    }

    const appModule = require(foundPath);
    app = appModule.default || appModule;
    
    console.log("🔍 [Debug] App module loaded. Attempting to listen on port " + port);
    
    const server = app.listen(port, "0.0.0.0", () => {
      console.log("🚀 SUCCESS: TikTok Generator UI is live at http://0.0.0.0:" + port);
    });

    server.on('error', (err: any) => {
      console.error("❌ [Debug] Server Listen Error:", err);
    });
  } catch (error) {
    console.error("❌ [Debug] Crash during server startup:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
