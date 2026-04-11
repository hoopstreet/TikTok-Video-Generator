import path from 'path';
import fs from 'fs';

export const startWebServer = (port: number) => {
  console.log("🔍 [Debug] Scanning for Express app export...");
  
  try {
    // We will check index.js and the REST router, as these are likely spots
    const targets = [
      path.join(process.cwd(), 'dist', 'index.js'),
      path.join(process.cwd(), 'dist', 'server', 'routers', 'rest.js'),
      path.join(process.cwd(), 'dist', 'components', 'root', 'Root.js')
    ];

    for (const target of targets) {
      if (!fs.existsSync(target)) continue;
      
      console.log("📂 Checking: " + target);
      const mod = require(target);
      
      // Look for the app object in common export names
      const app = mod.app || mod.default || (typeof mod === 'function' ? mod : null);

      if (app && typeof app.listen === 'function') {
        console.log("✅ SUCCESS: Found Express app in " + target);
        app.listen(port, "0.0.0.0", () => {
          console.log("🚀 TikTok Generator UI is LIVE on port " + port);
        });
        return;
      }
    }

    throw new Error("Could not find an exported Express app with a .listen() method.");

  } catch (error) {
    console.error("❌ [Debug] Startup Error:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
