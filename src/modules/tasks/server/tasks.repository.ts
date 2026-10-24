import { prisma } from "@/lib/prisma";
import { CreateTaskInput, ListTasksQuery } from "../model/types";

export const tasksRepository = {
  async findMany(query: ListTasksQuery) {
    const where = query.q
      ? { title: { contains: query.q, mode: "insensitive" as const } }
      : {};

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { [query.sort]: query.sortDir },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total };
  },
  async create(data: CreateTaskInput) {
    return prisma.task.create({ data });
  },
};
