import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  createUserSchema,
  listUsersMetaSchema,
  listUsersQuerySchema,
  userSchema,
} from "./schemas";

const apiErrorSchema = z
  .object({
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  })
  .openapi("ApiError");

const userOpenApi = userSchema.openapi("User");
const createUserOpenApi = createUserSchema.openapi("CreateUserInput");
const listMetaOpenApi = listUsersMetaSchema.openapi("ListUsersMeta");

export function registerUsersOpenApi(registry: OpenAPIRegistry) {
  registry.register("User", userOpenApi);
  registry.register("CreateUserInput", createUserOpenApi);
  registry.register("ListUsersMeta", listMetaOpenApi);
  registry.register("ApiError", apiErrorSchema);

  registry.registerPath({
    method: "get",
    path: "/api/users",
    summary: "List users",
    tags: ["users"],
    request: {
      query: listUsersQuerySchema,
    },
    responses: {
      200: {
        description: "Users list",
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(userOpenApi),
              meta: listMetaOpenApi,
            }),
          },
        },
      },
      400: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/users",
    summary: "Create user",
    tags: ["users"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: createUserOpenApi,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Created user",
        content: {
          "application/json": {
            schema: z.object({
              data: userOpenApi,
            }),
          },
        },
      },
      400: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/users/{id}",
    summary: "Get user by id",
    tags: ["users"],
    request: {
      params: z.object({
        id: z.coerce
          .number()
          .int()
          .positive()
          .openapi({
            param: { name: "id", in: "path" },
          }),
      }),
    },
    responses: {
      200: {
        description: "User",
        content: {
          "application/json": {
            schema: z.object({
              data: userOpenApi,
            }),
          },
        },
      },
      404: {
        description: "Not found",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });
}
