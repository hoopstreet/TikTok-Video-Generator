import { runpodHandler } from './runpod/handler';
// Importing everything as 'serverModule' to find the right start function
import * as serverModule from './server/server';

const mode = process.env.APP_MODE || 'WEB';

if (mode === 'WORKER') {
  console.log("🚀 Starting in RUNPOD WORKER mode...");
  const runpod = require('runpod-sdk');
  runpod.start({ handler: runpodHandler });
} else {
  console.log("🌐 Starting in WEB UI mode...");
  // Try to find a start function or default to a standard listener
  if ((serverModule as any).startWebServer) {
    (serverModule as any).startWebServer(Number(process.env.PORT) || 7860);
  } else {
    console.log("⚠️ startWebServer not found, check src/server/server.ts exports");
  }
}
