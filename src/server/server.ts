import express from "express";
import path from "path";
import os from "os";

const app = express();
const port = process.env.PORT || 3000;
export const baseDataPath = path.join(os.tmpdir(), "tiktok-gen");

app.use(express.json());

// Basic health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", baseDataPath });
});

export const startWebServer = () => {
    app.listen(port, () => {
        console.log(`🌐 Server running on port ${port}`);
        console.log(`📂 Temp data path: ${baseDataPath}`);
    });
};
