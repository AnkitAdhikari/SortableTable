import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;

export function jsonOk<T>(
  data: T,
  init?: ResponseInit & { meta?: Record<string, unknown> },
) {
  const { meta, ...responseInit } = init ?? {};
  const body: ApiSuccess<T> = meta === undefined ? { data } : { data, meta };
  return NextResponse.json(body, responseInit);
}

export function jsonError(
  error: { code: string; message: string; details?: unknown },
  status: number,
) {
  const body: ApiErrorBody = { error };
  return NextResponse.json(body, { status });
}
