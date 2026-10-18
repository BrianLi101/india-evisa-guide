// Native links intentionally avoid RSC fetches under production connect-src none.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
  globalIgnores([
    "out/**",
    ".next/**",
    "next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
  ]),
]);
