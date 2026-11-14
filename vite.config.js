import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Actions fournit /nom-du-depot/. En local, la valeur reste "/".
  base: process.env.VITE_BASE_PATH || "/"
});
