import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string().max(60).min(10),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    description: z.string().max(160),
    pubDate: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
};
