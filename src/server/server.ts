import express from "express";
import path from "path";
import os from "os";

const app = express();
const port = process.env.PORT || 7860;

app.use(express.json());

// The path where the built UI lives
const distPath = path.join(process.cwd(), "dist");

// 1. Serve static files from dist
app.use(express.static(distPath));

// 2. Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// 3. Catch-all: Send index.html for any request that doesn't match a file
// This is critical for React Router/Vite apps
app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 UI/API running on port ${port}`);
    });
};
