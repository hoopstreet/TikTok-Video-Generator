console.log("🌐 Starting in WEB UI mode [v2.0-DEBUG]...");

// Keep process alive immediately
const heartbeat = setInterval(() => {
    console.log("💓 Heartbeat: Event loop is free.");
}, 30000);

setTimeout(async () => {
    try {
        console.log("🚀 Attempting Dynamic Import of server...");
        
        // This prevents the app from hanging during the initial boot
        const { startWebServer } = await import('./server/server');
        
        console.log("📦 Server module loaded successfully.");
        const port = Number(process.env.PORT) || 7860;
        
        await startWebServer(port);
    } catch (err) {
        console.error("❌ Fatal Startup Error:", err);
    }
}, 2000);
