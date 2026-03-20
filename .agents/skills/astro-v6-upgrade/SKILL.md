---
name: astro-v6-upgrade
description: Guide for upgrading Astro projects from v5 to v6. Use when users mention upgrading Astro, Astro v6, Astro 6, or errors related to content collections, ViewTransitions, Astro.glob, Zod schemas, or Content Layer API.
---

# Astro v6 Upgrade Guide

## Quick Start

1. **Check Node version**: Astro v6 requires Node 22.12.0+ (`node -v`)
2. **Run upgrade**:
   ```bash
   npx @astrojs/upgrade    # npm
   pnpm dlx @astrojs/upgrade  # pnpm
   ```
3. **Check for legacy content collections** (see below)
4. **Fix any errors** using this guide

## Check: Legacy Content Collections

**Before upgrading**, check if the project needs content collection migration. Most v5 projects already use the Content Layer API and won't need changes.

**Decision tree:**

1. **Does `src/content/config.{js,ts,mjs,mts}` exist?**
   - Yes → needs migration (legacy config location)

2. **Are there content folders in `src/content/` but no config file anywhere?**
   - Yes → needs migration (implicit legacy collections)

3. **Otherwise, check `src/content.config.{js,ts,mjs,mts}` for:**
   - Any collection without a `loader` property → needs migration
   - Any collection with `type:` set → needs migration

If any of the above apply, load [content-collections.md](content-collections.md) and follow the migration steps.

## Quick Fixes

These are simple renames/replacements. Apply directly:

### ViewTransitions → ClientRouter

```astro
---
// Before
import { ViewTransitions } from 'astro:transitions';
// After
import { ClientRouter } from 'astro:transitions';
---

<!-- Before -->
<ViewTransitions />
<!-- After -->
<ClientRouter />
```

Remove `handleForms` prop if present - it's now default behavior.

### Astro.glob() → import.meta.glob()

```astro
---
// Before
const posts = await Astro.glob('./posts/*.md');

// After
const posts = Object.values(import.meta.glob('./posts/*.md', { eager: true }));
---
```

### Zod imports

```ts
// Before (deprecated)
import { z } from "astro:content";
import { z } from "astro:schema";

// After
import { z } from "astro/zod";
```

If using Zod validation extensively or if you encounter Zod errors, see [zod.md](zod.md) for Zod 4 syntax changes.

### Deprecated APIs

```ts
// Astro.site in getStaticPaths → import.meta.env.SITE
export function getStaticPaths() {
  const site = import.meta.env.SITE; // was Astro.site
}

// Astro.generator → just remove it

// import.meta.env.ASSETS_PREFIX → astro:config/server
import { build } from "astro:config/server";
const prefix = build.assetsPrefix;
```

### Removed: emitESMImage

```ts
// Before
import { emitESMImage } from "astro/assets/utils";
// After
import { emitImageMetadata } from "astro/assets/utils";
```

## Error Quick Reference

| Error                                  | Fix                                                                               |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| `LegacyContentConfigError`             | Move `src/content/config.ts` → `src/content.config.ts`                            |
| `ContentCollectionMissingALoaderError` | Add `loader` to collection - see [content-collections.md](content-collections.md) |
| `ContentCollectionInvalidTypeError`    | Remove `type: 'content'` or `type: 'data'` from collection                        |
| `GetEntryDeprecationError`             | Replace `getEntryBySlug()`/`getDataEntryById()` with `getEntry()`                 |
| `ContentSchemaContainsSlugError`       | Replace `.slug` with `.id`                                                        |
| Cannot find `ViewTransitions`          | Use `ClientRouter` (see above)                                                    |
| Cannot find `Astro.glob`               | Use `import.meta.glob()` (see above)                                              |
| Node version error                     | Upgrade to Node 22.12.0+                                                          |
| Zod validation errors                  | Check [zod.md](zod.md) for Zod 4 changes                                          |

## Deep Dive Files

Load these only when needed:

| File                                             | When to load                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| [content-collections.md](content-collections.md) | Legacy content collections need migration                                 |
| [zod.md](zod.md)                                 | Using Zod schemas with `.email()`, `.url()`, custom errors, or transforms |
| [behavior-changes.md](behavior-changes.md)       | Subtle issues: i18n redirects, script order, env vars, image sizing       |
| [integration-api.md](integration-api.md)         | Building integrations or adapters                                         |

## Experimental Flags to Remove

These flags are now stable or default. Remove from config:

```js
export default defineConfig({
  experimental: {
    // Remove all of these:
    liveContentCollections: true,
    preserveScriptOrder: true,
    staticImportMetaEnv: true,
    headingIdCompat: true,
    failOnPrerenderConflict: true, // Use prerenderConflictBehavior instead
  },
});
```

## Resources

- [Astro v6 Blog Post](https://astro.build/blog/astro-6/)
- [Content Layer Deep Dive](https://astro.build/blog/content-layer-deep-dive/)
