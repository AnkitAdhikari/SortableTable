import { prisma } from "@/lib/prisma";
import type { CreateUserInput, ListUsersQuery } from "../model/types";

export const usersRepository = {
  async findMany(query: ListUsersQuery) {
    const where = query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" as const } },
            { address: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [query.sort]: query.sortDir },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { rows, total };
  },

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: CreateUserInput) {
    return prisma.user.create({ data });
  },
};
