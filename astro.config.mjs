import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { unified } from "@astrojs/markdown-remark";
import remarkAlert from "remark-github-blockquote-alert";

export default defineConfig({
  site: "https://athiramk.com",
  integrations: [sitemap(), pagefind()],
  markdown: {
    // remark pipeline: needed for the callout plugin (Astro 7 defaults to a newer processor without remark plugins)
    processor: unified({ remarkPlugins: [remarkAlert] }),
    // `mermaid` blocks are drawn as diagrams in the browser instead of being syntax-highlighted.
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid"] },
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },
});
