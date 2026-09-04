import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// GitHub Pages serve em /<repo>/ (hoje: /MyWallet/). Use VITE_BASE_PATH=/ no preview local se precisar.
const base = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig(() => ({
  base,
  // server: {
  //   host: "::",
  //   port: 8080,
  // },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
}));
