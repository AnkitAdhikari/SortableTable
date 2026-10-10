#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const templateDir = join(root, "src/modules/_template");

const name = process.argv[2];

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error("Usage: pnpm gen:module <name>  (lowercase kebab-case)");
  process.exit(1);
}

const pascal = name
  .split("-")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join("");
const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);

const targetDir = join(root, "src/modules", name);
if (existsSync(targetDir)) {
  console.error(`Module already exists: ${targetDir}`);
  process.exit(1);
}

function walk(dir, fn) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, fn);
    } else {
      fn(full);
    }
  }
}

mkdirSync(dirname(targetDir), { recursive: true });
cpSync(templateDir, targetDir, { recursive: true });

walk(targetDir, (filePath) => {
  let nextPath = filePath;
  if (filePath.includes("__domain__")) {
    nextPath = filePath.replaceAll("__domain__", name);
    renameSync(filePath, nextPath);
  }

  const content = readFileSync(nextPath, "utf8")
    .replaceAll("__domain__", name)
    .replaceAll("__Domain__", pascal)
    .replaceAll("__domainCamel__", camel);
  writeFileSync(nextPath, content);
});

const appPage = join(root, "src/app", name, "page.tsx");
const appApi = join(root, "src/app/api", name, "route.ts");

mkdirSync(dirname(appPage), { recursive: true });
mkdirSync(dirname(appApi), { recursive: true });

writeFileSync(
  appPage,
  `import { ${pascal}Page } from "@/modules/${name}";

export default function ${pascal}RoutePage() {
  return <${pascal}Page />;
}
`,
);

writeFileSync(
  appApi,
  `export { GET } from "@/modules/${name}/server/http";

export const runtime = "nodejs";
`,
);

console.log(`Created module at src/modules/${name}`);
console.log(
  `Created app shells: src/app/${name}/page.tsx, src/app/api/${name}/route.ts`,
);
console.log(
  "Next: add OpenAPI registry entries and run pnpm gen:client when endpoints are ready.",
);
