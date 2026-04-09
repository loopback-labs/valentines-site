import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const configuredBasePath = process.env.VITE_BASE_PATH;
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const base = configuredBasePath || (repositoryName ? `/${repositoryName}/` : "/");

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
