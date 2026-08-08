import { build } from "esbuild";

const nodeProcessPlugin = {
  name: "node-process-shim",
  setup(build) {
    build.onResolve({ filter: /^(node:process|process)$/ }, () => ({
      path: "process",
      namespace: "node-shim-process",
    }));
    build.onLoad({ filter: /.*/, namespace: "node-shim-process" }, () => ({
      contents: `
        const proc = globalThis.process || {
          env: {},
          cwd: () => "/",
          nextTick: (fn) => setTimeout(fn, 0),
          version: "v20.0.0",
          versions: { node: "20.0.0" },
          stdout: { write: () => {} },
          stderr: { write: () => {} },
        };
        export default proc;
        export const env = proc.env;
        export const cwd = proc.cwd;
        export const nextTick = proc.nextTick;
        export const version = proc.version;
        export const versions = proc.versions;
      `,
      loader: "js",
    }));
  },
};

async function run() {
  console.log("Bundling Cloudflare Worker with esbuild and node:process shim...");
  await build({
    entryPoints: ["server/server/index-worker.ts"],
    bundle: true,
    format: "esm",
    platform: "node",
    target: "es2022",
    outfile: "dist/worker.js",
    plugins: [nodeProcessPlugin],
    alias: {
      bcrypt: "bcryptjs",
      "stripe-replit-sync": "scripts/mockStripeReplitSync.js",
    },
    external: [
      "cloudflare:node",
      "cloudflare:workers",
      "path",
      "fs",
      "stream",
      "events",
      "util",
      "buffer",
      "crypto",
      "net",
      "tls",
      "os",
      "zlib",
      "http",
      "https",
      "url",
      "async_hooks",
      "assert",
      "querystring",
      "module",
    ],
    banner: {
      js: `import { createRequire as __createRequire } from "node:module"; const require = __createRequire("file:///index.js");`,
    },
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });
  console.log("Worker bundle compiled successfully: dist/worker.js");
}

run().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
