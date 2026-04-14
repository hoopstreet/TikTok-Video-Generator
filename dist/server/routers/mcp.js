"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPRouter = void 0;
const express_1 = __importDefault(require("express"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const zod_1 = __importDefault(require("zod"));
const logger_1 = require("../../logger");
const shorts_1 = require("../../types/shorts");
class MCPRouter {
    router;
    shortCreator;
    transports = {};
    mcpServer;
    constructor(shortCreator) {
        this.router = express_1.default.Router();
        this.shortCreator = shortCreator;
        this.mcpServer = new mcp_js_1.McpServer({
            name: "Short Creator",
            version: "0.0.1",
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        this.setupMCPServer();
        this.setupRoutes();
    }
    setupMCPServer() {
        this.mcpServer.tool("get-video-status", "Get the status of a video (ready, processing, failed)", {
            videoId: zod_1.default.string().describe("The ID of the video"),
        }, async ({ videoId }) => {
            const status = this.shortCreator.status(videoId);
            return {
                content: [
                    {
                        type: "text",
                        text: status,
                    },
                ],
            };
        });
        this.mcpServer.tool("create-short-video", "Create a short video from a list of scenes", {
            scenes: zod_1.default.array(shorts_1.sceneInput).describe("Each scene to be created"),
            config: shorts_1.renderConfig.describe("Configuration for rendering the video"),
        }, async ({ scenes, config }) => {
            const videoId = await this.shortCreator.addToQueue(scenes, config);
            return {
                content: [
                    {
                        type: "text",
                        text: videoId,
                    },
                ],
            };
        });
    }
    setupRoutes() {
        this.router.get("/sse", async (req, res) => {
            logger_1.logger.info("SSE GET request received");
            const transport = new sse_js_1.SSEServerTransport("/mcp/messages", res);
            this.transports[transport.sessionId] = transport;
            res.on("close", () => {
                delete this.transports[transport.sessionId];
            });
            await this.mcpServer.connect(transport);
        });
        this.router.post("/messages", async (req, res) => {
            logger_1.logger.info("SSE POST request received");
            const sessionId = req.query.sessionId;
            const transport = this.transports[sessionId];
            if (transport) {
                await transport.handlePostMessage(req, res);
            }
            else {
                res.status(400).send("No transport found for sessionId");
            }
        });
    }
}
exports.MCPRouter = MCPRouter;
