import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync } from "node:fs";

function googleAnalyticsPlugin(measurementId: string | undefined): Plugin {
  return {
    name: "google-analytics",
    transformIndexHtml(html) {
      if (!measurementId?.trim()) {
        return html;
      }
      const id = measurementId.trim();
      const tags = [
        `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`,
        `<script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag("js", new Date());
      gtag("config", "${id}", { send_page_view: false });
    </script>`,
      ].join("\n    ");
      return html.replace("</head>", `    <!-- Google tag (gtag.js) -->\n    ${tags}\n  </head>`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const basePath = env.VITE_BASE_PATH || "/";

  return {
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
    googleAnalyticsPlugin(env.VITE_GA_MEASUREMENT_ID),
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
};
});
