"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "./api";
import { usersKeys } from "./keys";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}
