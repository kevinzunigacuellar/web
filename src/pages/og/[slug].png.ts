import type { APIContext } from 'astro';
import fs from 'fs/promises';
import satori from 'satori'
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

const InterReg = await fs.readFile(new URL('./fonts/Inter-Regular.ttf', import.meta.url));
const InterSemi = await fs.readFile(new URL('./fonts/Inter-SemiBold.ttf', import.meta.url));
const pages = import.meta.glob('../blog/*.mdx', { eager: true });

export async function get({ params } : APIContext) {
  let q = `../blog/${params.slug}.mdx`;
  // @ts-ignore
  const { title, description, pubDate } = pages[q].frontmatter;
  const date = new Date(pubDate).toLocaleDateString('en', { dateStyle: 'full'});
  const markup = html`
    <div style="color: #111827; width: 1200px; height: 768px; display: flex; flex-direction: column;">
      <div style="width: 100%; background-color: white; height: 80%; display:flex; justify-content: center; padding: 0px 50px; flex-direction: column;">
        <div style="color: #6b7280; font-size: 24px; line-height: 24px; padding-bottom: 20px;">${date}</div>
        <div style="font-size: 52px; font-weight: 600; color: #111827; padding-bottom: 30px;">${title}</div>
        <div style="color: #6b7280; font-size: 30px; line-height: 42px;">${description}</div>
      </div>
      <div style="background-color: #dbeafe; width: 100%; height: 20%; display: flex; align-items: center; justify-content: flex-end; padding: 0px 50px; border-top: 2px solid #bfdbfe;">
        <img src="https://avatars.githubusercontent.com/u/46791833?v=4" style="width: 60px; height: 60px; border-radius: 50%; margin-right: 20px; border: 2px solid #60a5fa;" />
        <div style="font-size: 30px; color: #1e3a8a; font-weight: 600;">kevinzunigacuellar</div>
      </div>
    </div>`;

  const svg = await satori(markup, {
    width: 1200,
    height: 768,
    fonts: [
      {
        name: 'Inter',
        data: InterReg,
        weight: 400,
      },
      {
        name: 'Inter',
        data: InterSemi,
        weight: 600,
      }
    ],
  });

  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  return {
    body: pngBuffer,
    encoding: 'binary',
  }
};

export async function getStaticPaths() {
  const paths = Object.keys(pages).map((path) => {
    const [, slug] = path.match(/\/blog\/(.*)\.mdx$/);
    return { params: { slug } };
  });
  return paths;
}