// @ts-ignore
import { httpServerHandler } from "cloudflare:node";
import { createServer } from "node:http";
import { app } from "./app";
import { registerRoutes } from "./routes";

const server = createServer(app);

let routesRegistered = false;
let initPromise: Promise<void> | null = null;

async function ensureRoutes() {
  if (routesRegistered) return;
  if (!initPromise) {
    initPromise = (async () => {
      await registerRoutes(app);
      routesRegistered = true;
    })();
  }
  await initPromise;
}

// Express global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("[Worker Error]", err);
  res.status(status).json({ message });
});

const nodeHandler = httpServerHandler(server);

export default {
  async fetch(request: Request, env: any, ctx: any) {
    await ensureRoutes();
    return nodeHandler.fetch(request, env, ctx);
  },
};
