import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import InterRegular from "@fontsource/inter/files/inter-latin-400-normal.woff";
import InterBold from "@fontsource/inter/files/inter-latin-700-normal.woff";
import { APIContext } from "astro";

const dimensions = {
  width: 1200,
  height: 630,
};

interface Frontmatter {
  frontmatter: {
    title: string;
    imageAlt: string;
    heroImage: string;
    pubDate: string;
    description: string;
  };
}

const pages = import.meta.glob<Frontmatter>("../blog/*.mdx", { eager: true });

export async function get({ params }: APIContext) {
  const q = `../blog/${params.id}.mdx`;

  const { title, description } = pages[q].frontmatter || {
    title: "",
    description: "",
  };

  const markup = html` <div
    style="color: #111827; width: 1200px; height: 768px; display: flex; flex-direction: column;"
  >
    <div
      style="width: 100%; background-color: white; height: 80%; display:flex; justify-content: center; padding: 0px 50px; flex-direction: column;"
    >
      <div
        style="font-size: 48px; font-weight: bold; color: #111827; padding-bottom: 20px;"
      >
        ${title}
      </div>
      <div style="color: #6b7280; font-size: 32px;">${description}</div>
    </div>
    <div
      style="background-color: #dbeafe; width: 100%; height: 20%; display: flex; align-items: center; justify-content: flex-end; padding: 0px 50px; border-top: 2px solid #bfdbfe;"
    >
      <img
        src="https://avatars.githubusercontent.com/u/46791833?v=4"
        style="width: 60px; height: 60px; border-radius: 50%; margin-right: 20px; border: 2px solid #60a5fa;"
      />
      <div style="font-size: 32px; color: #1e3a8a;">kevinzunigacuellar</div>
    </div>
  </div>`;

  const svg = await satori(markup, {
    fonts: [
      {
        name: "Inter",
        data: Buffer.from(InterRegular),
        weight: 400,
      },
      {
        name: "Inter",
        data: Buffer.from(InterBold),
        weight: 700,
      },
    ],
    height: dimensions.height,
    width: dimensions.width,
  });

  const image = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: dimensions.width,
    },
  }).render();

  return {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body: image.asPng(),
  };
}

export async function getStaticPaths() {
  const paths = Object.keys(pages).map((path) => {
    const [, id] = path.match(/\/blog\/(.*)\.mdx$/);
    return { params: { id } };
  });
  return paths;
}
