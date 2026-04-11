import express from "express";
import path from "path";
import os from "os";

const app = express();
const port = process.env.PORT || 7860;

app.use(express.json());

// Vite builds the UI into the 'dist' folder by default
const distPath = path.join(process.cwd(), "dist");

app.use(express.static(distPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 UI/API running on port ${port}`);
    });
};
