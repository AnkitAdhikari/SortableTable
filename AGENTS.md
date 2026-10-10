# Architecture (project rules)

Follow these rules for every change. Longer checklists: [src/modules/README.md](src/modules/README.md), [src/shared/README.md](src/shared/README.md).

## Layout

- `src/app/` — thin shells only (pages + `export { GET, POST } from '@/modules/.../server/http'`). No Prisma, Zod, or business logic.
- `src/modules/<domain>/` — colocated domain: `model/`, `server/`, `client/`, `ui/`. Public API via `index.ts`.
- `src/shared/` — http client, envelope, Query, nuqs/auth stubs, Zustand shell store, UI kit.

## State layers

| Kind          | Tool                     | Examples                                                                         |
| ------------- | ------------------------ | -------------------------------------------------------------------------------- |
| Server/cache  | TanStack Query           | lists, details, mutations                                                        |
| URL/shareable | nuqs (namespaced keys)   | filters, page, sort, drawer open, selected id                                    |
| Client global | Zustand (`shared/store`) | sidebar, theme, table density — not toasts; see `modules/users/ui/UsersPage.tsx` |
| Local         | `useState`               | ephemeral form UI within a component                                             |

## New endpoint / domain

1. Prefer `pnpm gen:module <name>` then fill in behavior.
2. Zod in `modules/<domain>/model/schemas.ts` (+ OpenAPI registry when ready).
3. Repository → service → `server/http.ts` → `app/api/...` re-export.
4. `client/api.ts` facade (over orval generated client when available) + `keys` → queries/mutations.
5. `client/search-params.ts` for URL state; UI under `ui/`; page under `app/<domain>/page.tsx`.
6. Run `pnpm gen:client` after OpenAPI/Zod registry changes. Do not hand-edit `client/generated/`.

## Data fetching & forms

- Client server-state: TanStack Query only (`useXQuery` / `useXMutation`).
- No `useEffect` + `fetch` in components; no Prisma in `"use client"` files.
- Forms: React Hook Form + Zod (`@hookform/resolvers/zod`).
- Prefer `@/modules/<domain>` barrel; UI must not import `server/**`.

## Drawers vs confirms

- Shareable create/detail: Ant Design **Drawer**, open via URL (`users.modal`, `users.userId`).
- Destructive/discard confirms: `confirmAction` from `@/shared/ui` (no URL / history).

## API contract

- Success: `{ data, meta? }`
- Error: `{ error: { code, message, details? } }`
- Use `jsonOk` / `jsonError`; stable codes (`USERS_VALIDATION_FAILED`, …).
- Client: `apiClient` unwraps envelope; orval mutator uses `apiClient`. Mutation errors toast via QueryClient `onError` → `notifyApiError`.

## Naming

- Hooks: `useUsersQuery`, `useCreateUserMutation`
- Keys: hierarchical factories; invalidate the narrowest correct key.
- URL keys: namespaced (`users.q`, `users.page`, …).

## Import boundaries

ESLint `boundaries/dependencies` enforces: `ui`/`client`/app pages must not import `module-server` or `@/lib/prisma`. `app/api` may import `server/http`.

## Do not

- Revive `customparameter`, boolean `status` envelopes, or prop-drilled refetch callbacks.
- Put domain logic in route files under `app/api`.
- Put toast queues in Zustand.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
