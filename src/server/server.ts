import express from 'express';
import { createServer } from 'http';
import app from './app';

export const startWebServer = (port: number) => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log("🚀 SUCCESS: TikTok Generator UI is live at http://0.0.0.0:" + port);
  });

  server.on('error', (err: any) => {
    console.error("Server Error:", err);
  });
};

// Ensure compatibility with the older require syntax used in index.ts
(module.exports as any).startWebServer = startWebServer;
