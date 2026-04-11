import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const port = process.env.PORT || 7860;

app.use(express.json());

// 1. Point exactly to where vite.config.ts outputs the build
const uiPath = path.join(process.cwd(), "dist/ui");
console.log(`📂 Final UI Path: ${uiPath}`);

app.use(express.static(uiPath));

app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        searching_at: uiPath,
        exists: fs.existsSync(uiPath) 
    });
});

app.get("*", (req, res) => {
    const indexPath = path.join(uiPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <h1>UI Still Building...</h1>
            <p>Server is looking in: <b>${uiPath}</b></p>
            <p>Check GitHub Actions to ensure <b>pnpm build</b> finished.</p>
        `);
    }
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 Server active on port ${port}`);
    });
};
