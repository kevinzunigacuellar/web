import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    heroImage: z.string(),
    imageAlt: z.string(),
    description: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
};
