import express from "express";
import path from "path";
import fs from "fs";
// Import your existing API router if you have one, 
// otherwise we ensure the routes exist here.

const app = express();
const port = process.env.PORT || 7860;

app.use(express.json());

const uiPath = path.join(process.cwd(), "dist/ui");

// 1. Serve static files
app.use(express.static(uiPath));

// 2. IMPORTANT: API Routes must be defined BEFORE the catch-all '*'
// This ensures your "Generate" button actually hits the backend logic
app.post("/api/videos", (req, res) => {
    console.log("🎬 Video generation request received:", req.body);
    // Trigger your video generation logic here
    res.json({ success: true, message: "Generation started" });
});

app.get("/health", (req, res) => {
    res.json({ status: "ok", port: port });
});

// 3. Catch-all for React Router
app.get("*", (req, res) => {
    res.sendFile(path.join(uiPath, "index.html"));
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 UI/API unified on port ${port}`);
    });
};
