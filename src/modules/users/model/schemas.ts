import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  age: z.number().int().min(0, "Age must be 0 or greater"),
  address: z.string().trim().min(1, "Address is required"),
});

export const userSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  age: z.number().int(),
  address: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const userSortSchema = z.enum(["id", "name", "age"]);
export const sortDirSchema = z.enum(["asc", "desc"]);

export const listUsersQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: userSortSchema.default("id"),
  sortDir: sortDirSchema.default("asc"),
});

export const userIdParamSchema = z.coerce.number().int().positive();

export const listUsersMetaSchema = z.object({
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
  sort: userSortSchema,
  sortDir: sortDirSchema,
});
