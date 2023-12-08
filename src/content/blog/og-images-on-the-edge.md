---
title: Generate OG images on the edge with Netlify
description: In this guide, you will learn how to generate open graph images on the edge using Netlify edge functions, deno, and Astro
pubDate: 2022-11-05
updatedDate: 2023-06-04
hero: "~/assets/heros/astro_netlify.png"
heroAlt: "The logo of Astro and Netlify"
---

In October 2022, Vercel open sourced [Satori](https://github.com/vercel/satori), a new library that enables React users to generate SVGs on the edge. This release unlocked the potential for faster generation of customizable images.

In this guide, we will use [og-edge](https://github.com/ascorbic/og-edge), a forked version of Satori ported to Deno by [Matt Kane](https://twitter.com/ascorbic), to generate open graph images on the edge with Netlify in your Astro project.

## Getting started

1. Create a new Astro project using the CLI:

   ```bash
   npm create astro@latest
   ```

2. Install the [Netlify CLI](https://docs.netlify.com/cli/get-started/#installation) globally on your machine to run Netlify edge functions locally during development:

   ```bash
   npm install -g netlify-cli
   ```

3. In the root of your project, create a new directory called `netlify/edge_functions`.

4. Inside the `edge_functions` folder, create a new file called `og.tsx`.

5. Finally, create a new file called `netlify.toml` in the root of your project and add the following configuration:

   ```toml title="netlify.toml"
   [[edge_functions]]
     function = "og"
     path = "/og-image"
   ```

   This configuration file declares a new edge function named `og` and replaces the default Netlify edge function path from `/.netlify/edge_functions/og-image` to `/og-image`.

## Creating an og image generator

To generate open graph images, we will utilize the `query` parameters on the `request` object to populate the image with dynamic content.

In the following example, we retrieve the `title` and `pubDate` query parameters from the request.

```tsx title="netlify/edge_functions/og.tsx" ins={2-5}
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);
  const title = params.get("title") ?? "Created with Netlify edge functions";
  const pubDate = params.get("pubDate") ?? new Date().toISOString();
}
```

Next, import the `ImageResponse` function from `og-edge` and `React` from `react`.

```tsx title="netlify/edge_functions/og.tsx" ins={1,2}
import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.2/mod.ts";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);
  const title = params.get("title") ?? "Created with Netlify edge functions";
  const pubDate = params.get("pubDate") ?? new Date().toISOString();
}
```

Finally, use the `ImageResponse` function to generate the open graph image and return it as a response.

```tsx title="netlify/edge_functions/og.tsx" ins={10-26}
import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.2/mod.ts";

export default function handler(req: Request) {
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);
  const title = params.get("title") ?? "Created with Netlify edge functions";
  const pubDate = params.get("pubDate") ?? new Date().toISOString();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: 32,
        }}
      >
        <div>{title}</div>
        <div>{pubDate}</div>
      </div>
    ),
  );
}
```

## Testing an edge function locally

To test your edge function locally, run the following command in the root of your project:

```bash
netlify dev
```

This will start a local development server on [localhost:8888](http://localhost:8888).

To test the edge function, navigate to [localhost:8888/og-image?title=Hello%20World&pubDate=2022-11-05](http://localhost:8888/og-image?title=Hello%20World&pubDate=2022-11-05) in your browser. You should see a blank example of an og image.

![Blank example of an og image](~/assets/content/blank-og.png)

## Customization possibilities

You have the freedom to customize the image as desired. Feel free to add more query parameters, modify the styling, or add additional elements.

For inspiration, here is the open graph image generated for this post.

![OG image for this blog post](~/assets/content/example-og.png)
