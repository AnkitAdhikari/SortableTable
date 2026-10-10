import { apiClient } from "@/shared/http/client";
import type { __Domain__ } from "../model/types";

export const __domainCamel__Api = {
  list: () => apiClient.get<__Domain__[]>("/api/__domain__"),
};
