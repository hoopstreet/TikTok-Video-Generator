import { runpodHandler } from './runpod/handler';
import { startWebServer } from './web/server';

const mode = process.env.APP_MODE || 'WEB';

if (mode === 'WORKER') {
  console.log("🚀 Starting in RUNPOD WORKER mode...");
  // This connects to the RunPod Serverless SDK
  const runpod = require('runpod-sdk');
  runpod.start({
    handler: runpodHandler
  });
} else {
  console.log("🌐 Starting in WEB UI mode...");
  startWebServer(Number(process.env.PORT) || 3123);
}
