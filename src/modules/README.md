# Modules

Domain code lives in `src/modules/<domain>/`. The Next.js `app/` directory is a thin shell for pages and route-handler re-exports.

Agent-facing rules: [AGENTS.md](../../AGENTS.md). Shared kit: [src/shared/README.md](../shared/README.md).

## Layout per domain

```text
modules/<domain>/
  index.ts
  model/          # Zod + types (+ openapi registry helpers)
  server/         # repository, service, http handlers
  client/
    search-params.ts
    keys.ts
    api.ts                 # facade over generated client or apiClient
    generated/             # orval output — do not hand-edit
    queries.ts / mutations.ts
  ui/
```

## Import boundaries

| From         | May import                                                  |
| ------------ | ----------------------------------------------------------- |
| `ui/`        | `client/*`, `model/*`, `@/shared/*`                         |
| `client/`    | `model/*`, `@/shared/http`, `@tanstack/react-query`, `nuqs` |
| `server/`    | `model/*`, `@/lib/prisma`, `@/shared/http/envelope`         |
| `app/` pages | `@/modules/<domain>` public barrel                          |
| `app/api`    | `@/modules/<domain>/server/http`                            |

**Do not:** import Prisma from `ui/` or `client/`; `fetch` from UI; put business logic in `app/`.

## URL list checklist

1. Add namespaced parsers in `client/search-params.ts` (`users.q`, `users.page`, …).
2. Map parsers → list query DTO for `useXQuery`.
3. Sync Ant Design Table pagination/sort to URL setters.
4. Open create/detail drawers via URL (`modal`, `userId`); confirms via `confirmAction`.

## OpenAPI / orval

1. Register paths in `model/openapi.ts` (see `users`).
2. `pnpm gen:client` → writes `openapi/openapi.json` + `client/generated/`.
3. Keep a thin `client/api.ts` facade; hooks import the facade only.
4. After adding endpoints, update the registry and regenerate.

## Scaffold a domain

```bash
pnpm gen:module orders
```

Copies `_template/`, creates `app/<name>/page.tsx` and `app/api/<name>/route.ts`. Add OpenAPI entries when the HTTP surface is real.

## Canonical example

[`users/`](./users/) — list (filter/sort/page via URL), create drawer (RHF+Zod), detail drawer, orval client, and Zustand session density via `useAppShellStore` on [`ui/UsersPage.tsx`](./users/ui/UsersPage.tsx).
