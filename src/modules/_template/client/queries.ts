"use client";

import { useQuery } from "@tanstack/react-query";
import { __domainCamel__Api } from "./api";
import { __domainCamel__Keys } from "./keys";

export function use__Domain__Query() {
  return useQuery({
    queryKey: __domainCamel__Keys.list(),
    queryFn: () => __domainCamel__Api.list(),
  });
}
