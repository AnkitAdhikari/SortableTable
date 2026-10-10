import type {
  CreateUserInput,
  ListUsersQuery,
  ListUsersResult,
  User,
} from "../model/types";
import { usersRepository } from "./users.repository";

function toUserDto(row: {
  id: number;
  name: string;
  age: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    address: row.address,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export class UsersNotFoundError extends Error {
  constructor(id: number) {
    super(`User ${id} not found`);
    this.name = "UsersNotFoundError";
  }
}

export const usersService = {
  async listUsers(query: ListUsersQuery): Promise<ListUsersResult> {
    const { rows, total } = await usersRepository.findMany(query);
    return {
      users: rows.map(toUserDto),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        sort: query.sort,
        sortDir: query.sortDir,
      },
    };
  },

  async getUser(id: number): Promise<User> {
    const row = await usersRepository.findById(id);
    if (!row) {
      throw new UsersNotFoundError(id);
    }
    return toUserDto(row);
  },

  async createUser(input: CreateUserInput): Promise<User> {
    const row = await usersRepository.create(input);
    return toUserDto(row);
  },
};
