import { TaskStatus } from "@prisma/client";
import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(TaskStatus).default(TaskStatus.TODO),
});

export const taskSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  status: z.enum(TaskStatus),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});

export const taskSortSchema = z.enum([
  "createdAt",
  "updatedAt",
  "title",
  "status",
  "TODO",
  "IN_PROGRESS",
  "DONE",
]);

export const listTasksQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: taskSortSchema.default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
});
