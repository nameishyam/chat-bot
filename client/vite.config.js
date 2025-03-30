import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Ensure it listens on all interfaces
    port: parseInt(import.meta.env.VITE_PORT) || 5173, // Use the VITE_PORT from environment or fallback
  },
});
