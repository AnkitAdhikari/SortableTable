import { listUsersMetaSchema, userSchema } from "../model/schemas";
import type {
  CreateUserInput,
  ListUsersMeta,
  ListUsersQuery,
  ListUsersResult,
  User,
} from "../model/types";
import {
  getApiUsers,
  getApiUsersId,
  postApiUsers,
} from "./generated/users/users";

function mapUser(data: unknown): User {
  return userSchema.parse(data);
}

function mapMeta(data: unknown): ListUsersMeta {
  return listUsersMetaSchema.parse(data);
}

export const usersApi = {
  async list(query: ListUsersQuery): Promise<ListUsersResult> {
    const response = await getApiUsers({
      q: query.q || undefined,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
      sortDir: query.sortDir,
    });

    return {
      users: response.data.map(mapUser),
      meta: mapMeta(response.meta),
    };
  },

  async get(id: number): Promise<User> {
    const response = await getApiUsersId(id);
    return mapUser(response.data);
  },

  async create(body: CreateUserInput): Promise<User> {
    const response = await postApiUsers(body);
    return mapUser(response.data);
  },
};
