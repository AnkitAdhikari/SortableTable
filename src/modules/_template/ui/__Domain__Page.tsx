"use client";

import { PageHeader, PageShell } from "@/shared/ui";
import { use__Domain__Query } from "../client/queries";

export function __Domain__Page() {
  const { data = [], isPending } = use__Domain__Query();

  return (
    <PageShell>
      <PageHeader title="__Domain__" />
      {isPending ? <p>Loading…</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </PageShell>
  );
}
