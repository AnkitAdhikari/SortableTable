import type { z } from "zod";
import { jsonError } from "./envelope";

type ParseJsonFailure = {
  code: string;
  message: string;
};

export type ParseJsonResult<T> =
  { ok: true; data: T } | { ok: false; response: ReturnType<typeof jsonError> };

export async function parseJson<T extends z.ZodType>(
  request: Request,
  schema: T,
  error: ParseJsonFailure,
): Promise<ParseJsonResult<z.output<T>>> {
  const body: unknown = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return {
      ok: false,
      response: jsonError(
        {
          code: error.code,
          message: error.message,
          details: parsed.error.flatten(),
        },
        400,
      ),
    };
  }

  return { ok: true, data: parsed.data };
}
