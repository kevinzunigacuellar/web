# Zod 4 Changes

Astro v6 upgrades to Zod 4, which has breaking changes to schema definitions. This applies if you use Zod schemas in content collections or Astro Actions.

## Import Change

```ts
// Before (deprecated)
import { z } from "astro:content";
import { z } from "astro:schema";

// After
import { z } from "astro/zod";
```

## String Format Methods

Many string format methods moved to top-level:

```ts
// Before (Zod 3)
z.string().email();
z.string().url();
z.string().uuid();
z.string().cuid();

// After (Zod 4)
z.email();
z.url();
z.uuid();
z.cuid();
```

Note: `z.string().regex(/pattern/)` is unchanged.

## Error Messages

```ts
// Before (Zod 3)
z.string().min(5, { message: "Too short." });

// After (Zod 4)
z.string().min(5, { error: "Too short." });
```

The `errorMap` option is no longer supported.

## Default Values with Transforms

In Zod 4, `.default()` must match the **output** type (after transforms), not the input type:

```ts
// Before (Zod 3) - default matched input type
z.string().transform(Number).default("0");

// After (Zod 4) - default must match output type
z.string().transform(Number).default(0);
```

If you want the default to be parsed (old behavior), use `.prefault()`:

```ts
z.string().transform(Number).prefault("0");
```

## Content Schema Example

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    // Before: z.string().email()
    authorEmail: z.email(),
    // Before: z.string().url().optional()
    website: z.url().optional(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog };
```

## Actions Schema Example

```ts
// src/actions/index.ts
import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const server = {
  subscribe: defineAction({
    input: z.object({
      email: z.email(), // was z.string().email()
    }),
    handler: async (input) => {
      // ...
    },
  }),
};
```

## Resources

- [Zod 4 Changelog](https://zod.dev/v4/changelog)
