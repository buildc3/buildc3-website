import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      // In local dev, the Express server (port 3001) handles function routes.
      // Run: pnpm dev:local  (starts both Vite + Express together)
      '/.netlify/functions': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // /netlify/functions/submit-join → /api/join
        rewrite: (p) => p.replace(/^\/.netlify\/functions\/(.+)$/, '/api/$1'),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
