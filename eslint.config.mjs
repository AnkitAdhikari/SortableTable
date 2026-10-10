import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: { boundaries },
    settings: {
      "boundaries/include": ["src/**/*.{ts,tsx}"],
      "boundaries/elements": [
        { type: "module-ui", pattern: "src/modules/*/ui" },
        { type: "module-client", pattern: "src/modules/*/client" },
        { type: "module-server", pattern: "src/modules/*/server" },
        { type: "module-model", pattern: "src/modules/*/model" },
        { type: "shared", pattern: "src/shared" },
        { type: "app-api", pattern: "src/app/api" },
        { type: "app", pattern: "src/app" },
        { type: "lib", pattern: "src/lib" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        2,
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "module-ui" } },
              disallow: {
                to: {
                  element: {
                    types: { anyOf: ["module-server", "lib"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "module-client" } },
              disallow: {
                to: {
                  element: {
                    types: { anyOf: ["module-server", "lib"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "app" } },
              disallow: {
                to: {
                  element: {
                    types: { anyOf: ["module-server", "lib"] },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/modules/**/client/generated/**",
    "src/modules/_template/**",
    "openapi/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
