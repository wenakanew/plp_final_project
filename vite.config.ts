
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Provide empty environment variables as defaults
    'import.meta.env.VITE_AZURE_OPENAI_ENDPOINT': JSON.stringify(''),
    'import.meta.env.VITE_DEPLOYMENT_NAME': JSON.stringify('gpt-4o'),
    'import.meta.env.VITE_API_VERSION': JSON.stringify('2024-12-01-preview'),
    'import.meta.env.VITE_TELEGRAM_CHANNELS': JSON.stringify('BBCBreaking,CNN'),
  }
}));
