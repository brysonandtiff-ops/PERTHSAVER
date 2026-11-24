# AGENTS.md

## Cursor Cloud specific instructions

Dependencies are installed with `npm ci` from `package-lock.json`.

- `npm run dev:client` is the Vite client on port 5000 (`client/` is the Vite root).
- `npm run dev` starts the Express dev server (`server/index-dev.ts`). It was not booted during environment setup. Do not assume a database is configured.

Neither server is started on boot. Port 5000 is left free.
