import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        'apicurio-editor-envelope': resolve(__dirname, "./src/apicurio-editor/envelope/apicurio-editor-envelope.html"),
        'text-editor-envelope': resolve(__dirname, "./src/text-editor/envelope/text-editor-envelope.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
