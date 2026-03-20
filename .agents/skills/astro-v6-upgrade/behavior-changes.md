# Behavior Changes

These changes may cause unexpected behavior even if your code still runs. Review if you experience issues.

## Endpoints with File Extensions

Endpoints like `/sitemap.xml` can no longer be accessed with trailing slash.

| URL             | v5    | v6      |
| --------------- | ----- | ------- |
| `/sitemap.xml`  | Works | Works   |
| `/sitemap.xml/` | Works | **404** |

**Fix**: Remove trailing slashes from links to endpoints with file extensions.

## getStaticPaths() Params Must Be Strings

Numbers are no longer auto-converted to strings:

```ts
export function getStaticPaths() {
  return [
    { params: { id: "1" } }, // Must be string, not number
  ];
}
```

## i18n Redirect Default Changed

`i18n.routing.redirectToDefaultLocale` now defaults to `false`.

- v5: Visitors to `/` redirected to `/{defaultLocale}/`
- v6: Visitors stay at `/`

**To restore old behavior:**

```js
export default defineConfig({
  i18n: {
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
});
```

## Script and Style Rendering Order

Tags now render in source order (previously reversed).

```astro
<style>body { background: yellow; }</style>
<style>body { background: red; }</style>
```

- v5: yellow wins (reversed order)
- v6: red wins (source order)

## import.meta.env Handling

**No more coercion**: String values like `"true"` aren't converted to booleans.

```ts
// Before - implicit coercion
const enabled: boolean = import.meta.env.ENABLED;

// After - explicit comparison
const enabled = import.meta.env.ENABLED === "true";
```

**Always inlined**: Non-public env vars are inlined at build time, not replaced with `process.env`.

```ts
// For server secrets, use process.env directly
const password = process.env.DB_PASSWORD;
```

## Image Behavior

**Cropping by default**: Images are cropped when both `width` and `height` are specified. Remove explicit `fit="contain"` if you had it.

**No upscaling**: Images are never upscaled beyond original dimensions.

## Markdown Heading IDs

Trailing hyphens are now preserved:

```md
## `<Picture />`
```

- v5: `id="picture"`
- v6: `id="picture-"`

Update anchor links if affected.

## Content Loader Schema (Custom Loaders Only)

If building custom loaders with dynamic schemas, use `createSchema()`:

```ts
function myLoader() {
  return {
    name: "my-loader",
    load: async (context) => {
      /* ... */
    },
    createSchema: async () => {
      const schema = await getSchemaFromApi();
      return { schema, types: `export type Entry = {...}` };
    },
  } satisfies Loader;
}
```

Use `satisfies Loader` instead of explicit return type for proper inference.
