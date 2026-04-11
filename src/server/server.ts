import path from 'path';
import fs from 'fs';

export const startWebServer = (port: number) => {
  console.log("🔍 [Debug] Deep-scanning for ANY server instance...");
  
  try {
    const targets = [
      path.join(process.cwd(), 'dist', 'index.js'),
      path.join(process.cwd(), 'dist', 'server', 'routers', 'rest.js'),
      path.join(process.cwd(), 'dist', 'components', 'root', 'Root.js'),
      path.join(process.cwd(), 'dist', 'server', 'server.js')
    ];

    for (const target of targets) {
      if (!fs.existsSync(target) || target === __filename) continue;
      
      const mod = require(target);
      // Scan all exported members for something that looks like a server
      for (const key in mod) {
        const item = mod[key];
        if (item && (typeof item.listen === 'function' || typeof item.fetch === 'function')) {
          console.log("✅ Found potential server: " + key + " in " + target);
          
          if (typeof item.listen === 'function') {
            item.listen(port, "0.0.0.0", () => {
              console.log("🚀 Server LIVE on port " + port);
            });
            return;
          }
        }
      }
    }
    throw new Error("No server instance found in exports.");
  } catch (error) {
    console.error("❌ [Debug] Startup Error:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
