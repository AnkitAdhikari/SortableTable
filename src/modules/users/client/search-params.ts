"use client";

import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type { ListUsersQuery } from "../model/types";

const usersParsers = {
  "users.q": parseAsString.withDefault(""),
  "users.page": parseAsInteger.withDefault(1),
  "users.pageSize": parseAsInteger.withDefault(10),
  "users.sort": parseAsStringEnum(["id", "name", "age"] as const).withDefault(
    "id",
  ),
  "users.sortDir": parseAsStringEnum(["asc", "desc"] as const).withDefault(
    "asc",
  ),
  "users.modal": parseAsStringEnum(["create"] as const),
  "users.userId": parseAsInteger,
};

export function useUsersSearchParams() {
  return useQueryStates(usersParsers, {
    history: "replace",
    shallow: true,
  });
}

export function toListUsersQuery(params: {
  "users.q": string;
  "users.page": number;
  "users.pageSize": number;
  "users.sort": "id" | "name" | "age";
  "users.sortDir": "asc" | "desc";
}): ListUsersQuery {
  return {
    q: params["users.q"],
    page: params["users.page"],
    pageSize: params["users.pageSize"],
    sort: params["users.sort"],
    sortDir: params["users.sortDir"],
  };
}
