import type { z } from "zod";
import type {
  createUserSchema,
  listUsersMetaSchema,
  listUsersQuerySchema,
  userSchema,
} from "./schemas";

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type ListUsersMeta = z.infer<typeof listUsersMetaSchema>;

export type ListUsersResult = {
  users: User[];
  meta: ListUsersMeta;
};
