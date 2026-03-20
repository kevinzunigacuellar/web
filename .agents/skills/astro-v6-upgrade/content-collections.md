# Content Collections Migration

This is the most significant change in Astro v6. The legacy Content Collections API (from Astro v2 and deprecated in v5) has been completely removed. All collections must use the Content Layer API.

## Quick Check

Your collections need updating if you have:

- Content files in `src/content/**` but no config file at `src/content/config.{js,mjs,ts,mts}` or `src/content.config.{js,mjs,ts,mts}`
- `src/content/config.*` (wrong config location)
- Collections without a `loader` property
- Collections with `type: 'content'` or `type: 'data'`
- Use of `getEntryBySlug()` or `getDataEntryById()`
- Use of `entry.slug` property
- Use of `entry.render()` method

## Migration Steps

### 1. Rename Config File

Move and rename your content config:

```bash
# Old location
src/content/config.ts

# New location
src/content.config.ts
```

The file must be at the project root's `src/` directory, not inside `src/content/`.

### 2. Add Loader to Collections

Every collection must define a `loader`. For local content, use the built-in `glob()` loader:

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Add loader - specify pattern and base directory
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog };
```

#### Glob Loader Options

```ts
glob({
  pattern: "**/*.{md,mdx}", // Glob pattern for files
  base: "./src/content/blog", // Base directory (relative to project root)
});
```

Common patterns:

- `'**/*.md'` - All markdown files
- `'**/*.{md,mdx}'` - Markdown and MDX
- `'**/[^_]*.md'` - All markdown except those starting with `_`
- `'*.json'` - JSON files in base directory only

### 3. Remove Type Property

The `type` property is no longer used. Remove it:

```ts
// Before (v5)
const blog = defineCollection({
  type: "content", // Remove this
  schema: z.object({
    /* ... */
  }),
});

// After (v6)
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    /* ... */
  }),
});
```

### 4. Update Query Methods

Replace deprecated query methods with `getEntry()`:

```ts
// Before (v5)
import { getEntryBySlug, getDataEntryById } from "astro:content";

const post = await getEntryBySlug("blog", "my-post");
const author = await getDataEntryById("authors", "john");

// After (v6)
import { getEntry } from "astro:content";

const post = await getEntry("blog", "my-post");
const author = await getEntry("authors", "john");
```

### 5. Replace slug with id

The `slug` property no longer exists. Use `id` instead:

```astro
---
// Before (v5)
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },  // ❌ No longer exists
    props: post,
  }));
}
---

---
// After (v6)
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },    // ✅ Use id
    props: post,
  }));
}
---
```

If you need the original filename (previously available as `id`), use `filePath`:

```ts
// v5: post.id was the filename, post.slug was URL-safe
// v6: post.id is URL-safe (was slug), post.filePath is the filename
```

### 6. Update Render Method

The `render()` method is no longer on the entry object. Import it from `astro:content`:

```astro
---
// Before (v5)
import { getEntry } from 'astro:content';

const post = await getEntry('blog', 'my-post');
const { Content, headings } = await post.render();
---
<Content />

---
// After (v6)
import { getEntry, render } from 'astro:content';

const post = await getEntry('blog', 'my-post');
const { Content, headings } = await render(post);
---
<Content />
```

## Complete Migration Example

### Before (v5 Legacy)

```ts
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

```astro
// src/pages/blog/[slug].astro
---
import { getCollection, getEntryBySlug } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await post.render();
---
<Content />
```

### After (v6 Content Layer)

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

```astro
// src/pages/blog/[slug].astro
---
import { getCollection, getEntry, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await render(post);
---
<Content />
```

## Data Collections

For data collections (JSON, YAML), use the same pattern:

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const authors = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    email: z.email(),
    bio: z.string().optional(),
  }),
});

export const collections = { authors };
```

## Remote Content

For remote content (APIs, CMSs), use custom loaders:

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const products = defineCollection({
  loader: async () => {
    const response = await fetch("https://api.example.com/products");
    const data = await response.json();
    return data.map((product) => ({
      id: product.slug,
      ...product,
    }));
  },
  schema: z.object({
    name: z.string(),
    price: z.number(),
  }),
});

export const collections = { products };
```

## Common Errors

### LegacyContentConfigError

**Cause**: Config file is at `src/content/config.ts`
**Fix**: Move to `src/content.config.ts`

### ContentCollectionMissingALoaderError

**Cause**: Collection doesn't define a `loader`
**Fix**: Add `loader: glob({ pattern: '...', base: '...' })`

### ContentCollectionInvalidTypeError

**Cause**: Collection has `type: 'content'` or `type: 'data'`
**Fix**: Remove the `type` property

### GetEntryDeprecationError

**Cause**: Using `getEntryBySlug()` or `getDataEntryById()`
**Fix**: Use `getEntry()` instead

### ContentSchemaContainsSlugError

**Cause**: Schema or queries use `slug` property
**Fix**: Replace `slug` with `id`

## Resources

- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [Content Layer Deep Dive](https://astro.build/blog/content-layer-deep-dive/)
- [Content Loader Reference](https://docs.astro.build/en/reference/content-loader-reference/)
