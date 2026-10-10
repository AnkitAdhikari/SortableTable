import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import { registerUsersOpenApi } from "../src/modules/users/model/openapi";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../openapi/openapi.json");

const registry = new OpenAPIRegistry();
registerUsersOpenApi(registry);

const generator = new OpenApiGeneratorV31(registry.definitions);
const document = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "next-app API",
    version: "1.0.0",
  },
  servers: [{ url: "/" }],
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Wrote ${outPath}`);
