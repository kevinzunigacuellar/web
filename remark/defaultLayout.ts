// sets a default layout for all mdx files

export default function setFallbackLayout() {
  return function (_tree : any, file: any) {
    const layout = file.data.astro.frontmatter.layout ?? "@layouts/BlogLayout.astro";
    file.data.astro.frontmatter.layout = layout;
  };
}