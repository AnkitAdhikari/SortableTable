import { jsonError, jsonOk } from "@/shared/http/envelope";
import {
  createUserSchema,
  listUsersQuerySchema,
  userIdParamSchema,
} from "../model/schemas";
import { UsersNotFoundError, usersService } from "./users.service";

function parseSearchParams(request: Request) {
  const url = new URL(request.url);
  return Object.fromEntries(url.searchParams.entries());
}

export async function GET(request: Request) {
  const parsed = listUsersQuerySchema.safeParse(parseSearchParams(request));

  if (!parsed.success) {
    return jsonError(
      {
        code: "USERS_VALIDATION_FAILED",
        message: "Invalid list query",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  const result = await usersService.listUsers(parsed.data);
  return jsonOk(result.users, { meta: result.meta });
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(
      {
        code: "USERS_VALIDATION_FAILED",
        message: "Invalid user",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  const user = await usersService.createUser(parsed.data);
  return jsonOk(user, { status: 201 });
}

export async function GET_BY_ID(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const parsed = userIdParamSchema.safeParse(rawId);

  if (!parsed.success) {
    return jsonError(
      {
        code: "USERS_VALIDATION_FAILED",
        message: "Invalid user id",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  try {
    const user = await usersService.getUser(parsed.data);
    return jsonOk(user);
  } catch (error) {
    if (error instanceof UsersNotFoundError) {
      return jsonError(
        {
          code: "USERS_NOT_FOUND",
          message: error.message,
        },
        404,
      );
    }
    throw error;
  }
}
