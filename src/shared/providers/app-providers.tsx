"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { QueryProvider } from "@/shared/query/provider";
import { AppErrorBoundary } from "@/shared/ui/AppErrorBoundary";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <AppErrorBoundary>{children}</AppErrorBoundary>
      </QueryProvider>
    </NuqsAdapter>
  );
}
