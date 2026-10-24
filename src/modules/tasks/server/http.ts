import { jsonError, jsonOk } from "@/shared/http/envelope";
import { parseJson } from "@/shared/http/parse-json";
import { createTaskSchema, listTasksQuerySchema } from "../model/schemas";
import { tasksService } from "./tasks.service";

function parseSearchParams(request: Request) {
  const url = new URL(request.url);
  return Object.fromEntries(url.searchParams.entries());
}

export async function GET(request: Request) {
  const parsed = listTasksQuerySchema.safeParse(parseSearchParams(request));

  if (!parsed.success) {
    return jsonError(
      {
        code: "TASKS_VALIDATION_FAILED",
        message: "Invalid list query",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  const result = await tasksService.listTasks(parsed.data);
  return jsonOk(result.tasks, { meta: result.meta });
}

export async function POST(request: Request) {
  const parsed = await parseJson(request, createTaskSchema, {
    code: "TASKS VALIDATION FAILED",
    message: "Invalid task",
  });

  if (!parsed.ok) return parsed.response;

  const task = await tasksService.createTask(parsed.data);
  return jsonOk(task, { status: 201 });
}
