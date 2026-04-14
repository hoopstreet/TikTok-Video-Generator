"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("🌐 Starting in WEB UI mode [v2.0-DEBUG]...");
// Keep process alive immediately
const heartbeat = setInterval(() => {
    console.log("💓 Heartbeat: Event loop is free.");
}, 30000);
setTimeout(async () => {
    try {
        console.log("🚀 Attempting Dynamic Import of server...");
        // Point specifically to the .js file in the dist structure
        const { startWebServer } = await import('./server/server.js');
        console.log("📦 Server module loaded successfully.");
        const port = Number(process.env.PORT) || 7860;
        await startWebServer(port);
    }
    catch (err) {
        console.error("❌ Fatal Startup Error:", err);
        console.log("🔍 Debug Path Check: Current directory is", process.cwd());
    }
}, 2000);
