import path from 'path';
import fs from 'fs';

const listFiles = (dir: string) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      listFiles(fullPath);
    } else {
      console.log("📄 Found file: " + fullPath);
    }
  }
};

export const startWebServer = (port: number) => {
  console.log("🔍 [Debug] Starting Path Discovery...");
  
  try {
    const distPath = path.join(process.cwd(), 'dist');
    console.log("📁 Scanning directory: " + distPath);
    listFiles(distPath);

    // After scanning, we'll try a flexible require
    // If we find ANY file named 'app.js', we try to load it
    const findApp = (dir: string): string | null => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                const found = findApp(fullPath);
                if (found) return found;
            } else if (file === 'app.js') {
                return fullPath;
            }
        }
        return null;
    };

    const foundPath = findApp(distPath);

    if (!foundPath) {
      throw new Error("CRITICAL: app.js was not found anywhere in /dist!");
    }

    console.log("✅ Auto-located app at: " + foundPath);
    const appModule = require(foundPath);
    const app = appModule.default || appModule;
    
    const server = app.listen(port, "0.0.0.0", () => {
      console.log("🚀 SUCCESS: TikTok Generator UI is live at http://0.0.0.0:" + port);
    });
  } catch (error) {
    console.error("❌ [Debug] Discovery Crash:", error);
  }
};

(module.exports as any).startWebServer = startWebServer;
