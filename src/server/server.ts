import express from "express";
import path from "path";
import os from "os";

const app = express();
const port = process.env.PORT || 7860;
export const baseDataPath = path.join(os.tmpdir(), "tiktok-gen");

app.use(express.json());

// 1. This serves your UI files (the blue web ui)
// Make sure your UI files are actually in the /static folder
app.use(express.static(path.join(process.cwd(), "static")));

// 2. Fallback route if index.html isn't found
app.get("/status", (req, res) => {
    res.json({ status: "API is Running", storage: baseDataPath });
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 UI/API running on port ${port}`);
    });
};
