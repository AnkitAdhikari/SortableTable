"use client";

import { useQuery } from "@tanstack/react-query";
import type { ListUsersQuery } from "../model/types";
import { usersApi } from "./api";
import { usersKeys } from "./keys";

export function useUsersQuery(filters: ListUsersQuery) {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => usersApi.list(filters),
  });
}

export function useUserQuery(id: number | null) {
  return useQuery({
    queryKey: usersKeys.detail(id ?? 0),
    queryFn: () => usersApi.get(id!),
    enabled: id !== null && id > 0,
  });
}
