export const startWebServer = (port: number) => {
  // Use a relative require that matches the dist structure
  const app = require('./app').default || require('./app');
  
  const server = app.listen(port, "0.0.0.0", () => {
    console.log("🚀 SUCCESS: TikTok Generator UI is live at http://0.0.0.0:" + port);
  });

  server.on('error', (err: any) => {
    console.error("Server Error:", err);
  });
};

// Ensure the index.js entry point can find this function
(module.exports as any).startWebServer = startWebServer;
