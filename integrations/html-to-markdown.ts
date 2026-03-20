import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

async function htmlToMarkdownContent(html: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .process(html);

  return String(file);
}

export default function htmlToMarkdown(): AstroIntegration {
  return {
    name: "html-to-markdown",
    hooks: {
      "astro:build:done": async ({ assets }) => {
        const htmlFiles = new Set<string>();

        for (const routeAssets of assets.values()) {
          for (const assetUrl of routeAssets) {
            if (assetUrl.pathname.endsWith(".html")) {
              htmlFiles.add(fileURLToPath(assetUrl));
            }
          }
        }


        for (const htmlFilePath of htmlFiles) {
          const html = await fs.readFile(htmlFilePath, "utf-8");
          const markdown = await htmlToMarkdownContent(html);
          const outputPath = htmlFilePath.replace(/\.html$/i, ".md");
          await fs.writeFile(outputPath, `${markdown}\n`, "utf-8");
        }
      },
    },
  };
}
