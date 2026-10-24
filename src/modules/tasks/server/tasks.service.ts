import { TaskStatus } from "@prisma/client";
import { CreateTaskInput, ListTasksQuery, Task } from "../model/types";
import { tasksRepository } from "./tasks.repository";

function toTaskDto(row: {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const tasksService = {
  async listTasks(query: ListTasksQuery) {
    const { tasks, total } = await tasksRepository.findMany(query);
    return {
      tasks: tasks.map(toTaskDto),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        sort: query.sort,
        sortDir: query.sortDir,
      },
    };
  },
  async createTask(input: CreateTaskInput) {
    const row = await tasksRepository.create(input);
    return toTaskDto(row);
  },
};
