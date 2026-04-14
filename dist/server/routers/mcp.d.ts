import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { ShortCreator } from "../../short-creator/ShortCreator";
export declare class MCPRouter {
    router: express.Router;
    shortCreator: ShortCreator;
    transports: {
        [sessionId: string]: SSEServerTransport;
    };
    mcpServer: McpServer;
    constructor(shortCreator: ShortCreator);
    private setupMCPServer;
    private setupRoutes;
}
