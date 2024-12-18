import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { comlink } from "vite-plugin-comlink";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react(), comlink()],
  worker: {
    plugins: () => [comlink()],
  },
  base: "/apicurio-editors",
});
