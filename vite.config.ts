import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync } from "node:fs";

// Domain-safe default for custom domains; override with VITE_BASE_PATH for subpath deploys.
const basePath = process.env.VITE_BASE_PATH || "/";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? basePath : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: "github-pages-spa-fallback",
      apply: "build" as const,
      closeBundle() {
        copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
