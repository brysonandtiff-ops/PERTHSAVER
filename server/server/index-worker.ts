import { httpServerHandler } from "cloudflare:node";
import { app } from "./app";
import { registerRoutes } from "./routes";

// Ensure API routes are registered
await registerRoutes(app);

// Express global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("[Worker Error]", err);
  res.status(status).json({ message });
});

// Export Cloudflare Worker HTTP Server Handler
export default httpServerHandler(app);
