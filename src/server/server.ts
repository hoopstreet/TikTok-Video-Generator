import path from 'path';
import fs from 'fs';

export const startWebServer = (port: number) => {
  console.log("🔍 [Debug] Final attempt to locate app logic...");
  
  try {
    // According to your scan, these are the only logical places
    const possiblePaths = [
      path.join(process.cwd(), 'dist', 'index.js'),
      path.join(process.cwd(), 'dist', 'server', 'routers', 'rest.js')
    ];

    let foundPath = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        console.log("✅ Trying module at: " + p);
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      throw new Error("Could not find index.js or rest.js");
    }

    const appModule = require(foundPath);
    // If index.js IS the app, use it. If it exports an app, use that.
    const app = appModule.default || appModule;
    
    // Check if the required module has a .listen function
    if (typeof app.listen !== 'function') {
       console.log("⚠️ Module found but it's not an Express app. It might be the entry point.");
       return; 
    }

    const server = app.listen(port, "0.0.0.0", () => {
      console.log("🚀 SUCCESS: TikTok Generator UI is live at port " + port);
    });

  } catch (error) {
    console.error("❌ [Debug] Startup Error:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
