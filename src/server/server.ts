import express from "express";
import path from "path";
import os from "os";

const app = express();
const port = process.env.PORT || 7860;

app.use(express.json());

// Serve static files from the 'static' directory
// This ensures that /css, /js, and /images are all accessible
app.use(express.static(path.join(process.cwd(), "static")));

// Specific route to ensure index.html is served at the root
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "static", "index.html"));
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 UI/API running on port ${port}`);
    });
};
