import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const port = process.env.PORT || 7860;

app.use(express.json());

// Identify possible UI locations
const paths = [
    path.join(process.cwd(), "dist"),
    path.join(process.cwd(), "static"),
    path.join(__dirname, "../../dist"),
    path.join(__dirname, "../../static")
];

// Find the first path that actually exists
const uiPath = paths.find(p => fs.existsSync(p)) || paths[0];
console.log(`📂 Serving UI from: ${uiPath}`);

app.use(express.static(uiPath));

app.get("/health", (req, res) => {
    res.json({ status: "ok", ui_path: uiPath });
});

app.get("*", (req, res) => {
    const indexPath = path.join(uiPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("<h1>UI Not Found</h1><p>The build folder is missing index.html. Check Docker build logs.</p>");
    }
});

export const startWebServer = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🌐 Server active on port ${port}`);
    });
};
