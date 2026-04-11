import express from "express";
import path from "path";
import fs from "fs";
import { restRouter } from "./routers/rest";

const app = express();
app.use(express.json());

const uiPath = path.join(process.cwd(), "dist/ui");

// 1. Serve UI
app.use(express.static(uiPath));

// 2. Connect the Proxy Router
app.use("/api", restRouter);

app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        mode: "proxy-to-runpod",
        endpoint: process.env.RUNPOD_ENDPOINT_ID ? "configured" : "missing"
    });
});

app.get("*", (req, res) => {
    const indexPath = path.join(uiPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("UI build missing.");
    }
});

export const startWebServer = (port: number) => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 Proxy Server active on port ${port}`);
    });
};
