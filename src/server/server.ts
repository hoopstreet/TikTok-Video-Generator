import express from "express";
import path from "path";
import fs from "fs";
import { APIRouter } from "./routers/rest";
import { ShortCreator } from "../short-creator/ShortCreator";
import { Config } from "../config";

const app = express();
app.use(express.json());

// Initialize Dependencies
const config = new Config();
const shortCreator = new ShortCreator(config);
const api = new APIRouter(config, shortCreator);

const uiPath = path.join(process.cwd(), "dist/ui");

// 1. Serve UI
app.use(express.static(uiPath));

// 2. Connect the initialized Router
app.use("/api", api.router);

app.get("/health", (req, res) => {
    res.json({ status: "ok", engine: "initialized" });
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
        console.log(`🌐 UI/API unified on port ${port}`);
    });
};
