// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astrolint from "eslint-plugin-astro";

export default tseslint.config(
  { ignores: [".astro/", "dist/"] },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...astrolint.configs.recommended,
);
