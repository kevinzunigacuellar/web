# Integration & Adapter API Changes

This document covers changes for **integration and adapter authors**. If you're only using integrations (not building them), you likely don't need this.

## Vite Environment API Integration

Astro v6 uses Vite's new Environment API for build configuration and dev server interactions.

### astro:build:setup Hook

The hook is now called **once** with all environments, instead of separately for each build target.

```ts
// Before (v5) - called multiple times
{
  hooks: {
    'astro:build:setup': ({ target, vite }) => {
      if (target === 'client') {
        vite.build.minify = false;
      }
    }
  }
}

// After (v6) - called once, use environments
{
  hooks: {
    'astro:build:setup': ({ vite }) => {
      vite.environments.client.build.minify = false;
    }
  }
}
```

Available environments:

- `vite.environments.client` - Client-side build
- `vite.environments.ssr` - SSR build
- `vite.environments.prerender` - Prerender build

### HMR Access

Replace `server.hot.send()` with environment-specific access:

```ts
// Before
server.hot.send(event);

// After
server.environments.client.hot.send(event);
```

This affects:

- Custom integrations using HMR
- Dev toolbar apps
- Any code that sends HMR events

## astro:ssr-manifest Removed

The `astro:ssr-manifest` virtual module has been removed.

### Migration

Use `astro:config/server` to access configuration values:

```ts
// Before
import { manifest } from "astro:ssr-manifest";
const srcDir = manifest.srcDir;

// After
import { srcDir, outDir, root } from "astro:config/server";
```

For build-specific manifest data, use the `astro:build:ssr` integration hook which receives the manifest as a parameter.

## RouteData.generate() Removed

The `generate()` method on `RouteData` has been removed. Route generation is now handled internally by Astro.

```ts
// Before
const generated = route.generate(params);

// After
// Remove this call - Astro handles it internally
```

## routes on astro:build:done Removed

The `routes` array is no longer passed to the `astro:build:done` hook.

### Migration

Use `astro:routes:resolved` hook instead:

```ts
// Before
const integration = () => {
  return {
    name: "my-integration",
    hooks: {
      "astro:build:done": ({ routes }) => {
        console.log(routes);
      },
    },
  };
};

// After
const integration = () => {
  let routes;
  return {
    name: "my-integration",
    hooks: {
      "astro:routes:resolved": (params) => {
        routes = params.routes;
      },
      "astro:build:done": ({ assets }) => {
        // Add distURL from assets map
        for (const route of routes) {
          const distURL = assets.get(route.pattern);
          if (distURL) {
            Object.assign(route, { distURL });
          }
        }
        console.log(routes);
      },
    },
  };
};
```

## entryPoints on astro:build:ssr Removed

The `entryPoints` parameter has been removed from the `astro:build:ssr` hook (it was always empty after `functionPerRoute` deprecation).

```ts
// Before
{
  hooks: {
    'astro:build:ssr': ({ entryPoints }) => {
      someLogic(entryPoints);  // Remove this
    }
  }
}

// After
{
  hooks: {
    'astro:build:ssr': (params) => {
      // entryPoints no longer available
    }
  }
}
```

## app.render() Signature

The old `app.render()` signature with separate arguments has been removed.

```ts
// Before
app.render(request, routeData, locals);

// After
app.render(request, { routeData, locals });
```

Pass `routeData` and `locals` as properties of an options object.

## app.setManifestData() Removed

This method is no longer available on `App` or `NodeApp`.

```ts
// Before
app.setManifestData(data);

// After
// Create a new App instance if you need to update the manifest
const newApp = new App(newManifest);
```

## SSRManifest Interface Changes

Path properties are now `URL` objects instead of strings.

### Affected Properties

- `srcDir`
- `outDir`
- `cacheDir`
- `publicDir`
- `buildClientDir`
- `buildServerDir`

### Migration

```ts
// Before - string
const srcPath = manifest.srcDir;
// Result: "file:///path/to/src"

// After - URL object
const srcPath = manifest.srcDir.href;
// Result: "file:///path/to/src"

// Or use URL methods
const srcPathname = manifest.srcDir.pathname;
// Result: "/path/to/src"
```

### Removed Property

`hrefRoot` is no longer available on the manifest.

### Async Methods

`serverIslandMappings` and `sessionDriver` are now async methods:

```ts
// Before
const mappings = manifest.serverIslandMappings;
const driver = manifest.sessionDriver;

// After
const mappings = await manifest.serverIslandMappings?.();
const driver = await manifest.sessionDriver?.();
```

## Experimental Flags Removed

Remove these from integrations that check for them:

```ts
// These flags no longer exist
config.experimental.liveContentCollections;
config.experimental.preserveScriptOrder;
config.experimental.staticImportMetaEnv;
config.experimental.headingIdCompat;
config.experimental.failOnPrerenderConflict;
```

For `failOnPrerenderConflict`, check the new config option:

```ts
config.prerenderConflictBehavior; // 'error' | 'warn'
```

## Migration Checklist

- [ ] Update `astro:build:setup` to use `vite.environments`
- [ ] Update HMR calls to `server.environments.client.hot`
- [ ] Replace `astro:ssr-manifest` with `astro:config/server`
- [ ] Remove `route.generate()` calls
- [ ] Migrate from `astro:build:done` routes to `astro:routes:resolved`
- [ ] Remove `entryPoints` usage from `astro:build:ssr`
- [ ] Update `app.render()` to use options object
- [ ] Remove `app.setManifestData()` calls
- [ ] Update manifest property access to handle URL objects
- [ ] Make `serverIslandMappings` and `sessionDriver` calls async
- [ ] Remove experimental flag checks

## Resources

- [Vite Environment API](https://vite.dev/guide/api-environment)
- [Integration API Reference](https://docs.astro.build/en/reference/integrations-reference/)
- [Adapter API Reference](https://docs.astro.build/en/reference/adapter-reference/)
