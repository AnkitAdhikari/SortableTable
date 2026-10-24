import z from "zod";
import { createTaskSchema, listTasksQuerySchema, taskSchema } from "./schemas";

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type Task = z.infer<typeof taskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
