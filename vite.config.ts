
import { defineConfig, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  // путь к сертификатам
  const certPath = path.resolve(__dirname, "cert.pem");
  const keyPath = path.resolve(__dirname, "key.pem");

  // Check if certificates exist
  const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);
  
  return {
    server: {
      host: "::",
      port: 8080,
      https: hasCerts ? {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      } : undefined, // Use undefined instead of false when certs don't exist
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
