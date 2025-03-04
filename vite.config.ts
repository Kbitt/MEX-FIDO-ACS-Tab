/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    allowedHosts: ["7610-73-140-214-158.ngrok-free.app"],
    port: 53000,
    https: {
      cert: process.env.SSL_CRT_FILE
        ? fs.readFileSync(process.env.SSL_CRT_FILE)
        : undefined,
      key: process.env.SSL_KEY_FILE
        ? fs.readFileSync(process.env.SSL_KEY_FILE)
        : undefined,
    },
  },
});
