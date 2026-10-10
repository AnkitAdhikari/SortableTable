import { apiClient } from "./client";

/**
 * Orval fetch mutator — signature `(url, init)` as emitted by orval's fetch client.
 * Returns the JSON success envelope `{ data, meta? }` (unwrapped HTTP status via apiClient).
 */
export async function orvalMutator<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const options = {
    headers: init?.headers,
    signal: init?.signal ?? undefined,
  };

  let body: unknown;
  if (typeof init?.body === "string" && init.body.length > 0) {
    body = JSON.parse(init.body) as unknown;
  }

  switch (method) {
    case "GET": {
      const payload = await apiClient.getWithMeta<unknown>(url, options);
      return payload as T;
    }
    case "POST": {
      const data = await apiClient.post<unknown>(url, body, options);
      return { data } as T;
    }
    case "PUT": {
      const data = await apiClient.put<unknown>(url, body, options);
      return { data } as T;
    }
    case "PATCH": {
      const data = await apiClient.patch<unknown>(url, body, options);
      return { data } as T;
    }
    case "DELETE": {
      const data = await apiClient.delete<unknown>(url, options);
      return { data } as T;
    }
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}

export default orvalMutator;
