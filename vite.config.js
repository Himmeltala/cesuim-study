import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItPrism from "markdown-it-prism";
import Markdown from "unplugin-vue-markdown/vite";
import cesium from "vite-plugin-cesium";

export default defineConfig({
  plugins: [
    cesium(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      include: [/\.md$/],
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItSetup(md) {
        md.use(MarkdownItAnchor);
        md.use(MarkdownItPrism);
      },
      wrapperClasses: "markdown-body",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
