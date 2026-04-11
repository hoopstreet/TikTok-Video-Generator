import express from "express";
import path from "path";
import os from "os";

const app = express();
const port = process.env.PORT || 7860;
export const baseDataPath = path.join(os.tmpdir(), "tiktok-gen");

app.use(express.json());

// Serve the static files from your 'static' or 'dist' folder
app.use(express.static(path.join(process.cwd(), "static")));

// Root route - redirect to health or index
app.get("/", (req, res) => {
    res.send("<h1>TikTok Video Generator API is Running</h1><p>Check /health for status.</p>");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok", port, baseDataPath });
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 Server running on port ${port}`);
    });
};
