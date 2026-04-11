import express from "express";
import path from "path";
import fs from "fs";
import { restRouter } from "./routers/rest";
// import { mcpRouter } from "./routers/mcp"; // Add if you need MCP support too

const app = express();
const port = process.env.PORT || 7860;

app.use(express.json());

const uiPath = path.join(process.cwd(), "dist/ui");

// 1. Serve static files from the Vite build
app.use(express.static(uiPath));

// 2. Connect your REAL API routes
app.use("/api", restRouter);

app.get("/health", (req, res) => {
    res.json({ status: "ok", port: port, engine: "rest" });
});

// 3. Catch-all for React Router navigation
app.get("*", (req, res) => {
    const indexPath = path.join(uiPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("UI build missing. Check GitHub Actions.");
    }
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 UI/API unified on port ${port}`);
    });
};
