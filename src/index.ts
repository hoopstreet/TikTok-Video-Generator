import { runpodHandler } from './runpod/handler';
import { startWebServer } from './server/server';

const mode = process.env.APP_MODE || 'WEB';

if (mode === 'WORKER') {
  console.log("🚀 Starting in RUNPOD WORKER mode...");
  const runpod = require('runpod-sdk');
  runpod.start({
    handler: runpodHandler
  });
} else {
  console.log("🌐 Starting in WEB UI mode...");
  // Defaulting to 3123 for Hugging Face
  startWebServer(Number(process.env.PORT) || 3123);
}
