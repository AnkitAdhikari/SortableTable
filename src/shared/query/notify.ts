import { message } from "antd";
import { ApiError } from "@/shared/http/errors";

export function notifyApiError(error: unknown) {
  if (error instanceof ApiError) {
    void message.error(error.message);
    return;
  }

  if (error instanceof Error) {
    void message.error(error.message);
    return;
  }

  void message.error("Something went wrong");
}

export function notifySuccess(content: string) {
  void message.success(content);
}
