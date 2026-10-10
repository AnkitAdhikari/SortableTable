"use client";

import { Button, Input, Spin } from "antd";
import { useState } from "react";
import { useAppShellStore } from "@/shared/store/app-shell-store";
import {
  EmptyState,
  ErrorAlert,
  ListToolbar,
  PageHeader,
  PageShell,
} from "@/shared/ui";
import {
  toListUsersQuery,
  useUsersSearchParams,
} from "../client/search-params";
import { useUsersQuery } from "../client/queries";
import { CreateUserDrawer } from "./CreateUserDrawer";
import { UserDetailDrawer } from "./UserDetailDrawer";
import { UsersTable } from "./UsersTable";

/**
 * Reference page for state layers:
 * - TanStack Query → server list/detail
 * - nuqs → shareable filters / drawers (`users.*` params)
 * - Zustand (`useAppShellStore`) → session UI prefs (table density), not URL
 */
export function UsersPage() {
  const [params, setParams] = useUsersSearchParams();
  const urlQ = params["users.q"];
  const [draftQ, setDraftQ] = useState(urlQ);
  const [seenUrlQ, setSeenUrlQ] = useState(urlQ);

  // Keep the search box in sync when URL changes (back/forward, clear, shared links).
  if (urlQ !== seenUrlQ) {
    setSeenUrlQ(urlQ);
    setDraftQ(urlQ);
  }

  const tableDensity = useAppShellStore((state) => state.tableDensity);
  const toggleTableDensity = useAppShellStore(
    (state) => state.toggleTableDensity,
  );
  const listQuery = toListUsersQuery(params);
  const { data, isPending, isError, error, isFetching } =
    useUsersQuery(listQuery);

  const users = data?.users ?? [];
  const meta = data?.meta ?? {
    page: listQuery.page,
    pageSize: listQuery.pageSize,
    total: 0,
    sort: listQuery.sort,
    sortDir: listQuery.sortDir,
  };

  return (
    <PageShell>
      <PageHeader title="Users" description="Search, sort, and manage users." />

      <ListToolbar
        search={
          <Input.Search
            allowClear
            placeholder="Search name or address"
            value={draftQ}
            onChange={(event) => setDraftQ(event.target.value)}
            onSearch={(value) =>
              void setParams({ "users.q": value, "users.page": 1 })
            }
            onClear={() => {
              setDraftQ("");
              void setParams({ "users.q": "", "users.page": 1 });
            }}
            style={{ width: 280 }}
          />
        }
        actions={
          <>
            <Button onClick={toggleTableDensity}>
              Density: {tableDensity}
            </Button>
            <Button
              type="primary"
              onClick={() => void setParams({ "users.modal": "create" })}
            >
              Add user
            </Button>
          </>
        }
      />

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      ) : null}

      {isError ? (
        <ErrorAlert
          title="Could not load users"
          description={error instanceof Error ? error.message : undefined}
        />
      ) : null}

      {!isPending && !isError && users.length === 0 ? (
        <EmptyState
          description="No users found"
          action={
            <Button
              type="primary"
              onClick={() => void setParams({ "users.modal": "create" })}
            >
              Add user
            </Button>
          }
        />
      ) : null}

      {!isPending && !isError && users.length > 0 ? (
        <UsersTable
          rows={users}
          meta={meta}
          loading={isFetching}
          size={tableDensity === "compact" ? "small" : "middle"}
          onPageChange={(page, pageSize) =>
            void setParams({ "users.page": page, "users.pageSize": pageSize })
          }
          onSortChange={(sort, sortDir) =>
            void setParams({ "users.sort": sort, "users.sortDir": sortDir })
          }
          onOpenUser={(id) => void setParams({ "users.userId": id })}
        />
      ) : null}

      <CreateUserDrawer
        open={params["users.modal"] === "create"}
        onClose={() => void setParams({ "users.modal": null })}
      />

      <UserDetailDrawer
        userId={params["users.userId"]}
        onClose={() => void setParams({ "users.userId": null })}
      />
    </PageShell>
  );
}
