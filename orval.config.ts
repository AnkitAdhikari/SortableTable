import { defineConfig } from "orval";

export default defineConfig({
  users: {
    input: "./openapi/openapi.json",
    output: {
      target: "./src/modules/users/client/generated/api.ts",
      schemas: "./src/modules/users/client/generated/models",
      client: "fetch",
      mode: "tags-split",
      override: {
        mutator: {
          path: "./src/shared/http/orval-mutator.ts",
          name: "orvalMutator",
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
});
