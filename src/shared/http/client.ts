import { getClientSession } from "@/shared/auth/session";
import { ApiError } from "./errors";
import type { ApiErrorBody, ApiSuccess } from "./envelope";

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
  body?: unknown;
};

export type ApiSuccessPayload<T> = ApiSuccess<T>;

function getDefaultHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const session = getClientSession();
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return headers;
}

async function request<T>(
  path: string,
  method: string,
  options: RequestOptions = {},
): Promise<ApiSuccessPayload<T>> {
  const { body, headers, ...rest } = options;

  const response = await fetch(path, {
    method,
    ...rest,
    headers: {
      ...getDefaultHeaders(),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = json as ApiErrorBody | null;
    throw new ApiError({
      status: response.status,
      code: errorBody?.error?.code ?? "UNKNOWN_ERROR",
      message: errorBody?.error?.message ?? "Request failed",
      details: errorBody?.error?.details,
    });
  }

  const success = json as ApiSuccess<T> | null;
  if (success === null || !("data" in success)) {
    throw new ApiError({
      status: response.status,
      code: "INVALID_RESPONSE",
      message: "Response missing data envelope",
    });
  }

  return success;
}

/** Unwraps `data` only — use `requestWithMeta` when `meta` is needed. */
async function requestData<T>(
  path: string,
  method: string,
  options?: RequestOptions,
): Promise<T> {
  const payload = await request<T>(path, method, options);
  return payload.data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    requestData<T>(path, "GET", options),
  getWithMeta: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, "GET", options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    requestData<T>(path, "POST", { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    requestData<T>(path, "PATCH", { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    requestData<T>(path, "PUT", { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    requestData<T>(path, "DELETE", options),
};
