# Shared

Cross-cutting building blocks used by all modules.

## Inventory

| Path                          | Purpose                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `http/client.ts`              | `apiClient` — envelope unwrap, auth headers stub                                                  |
| `http/envelope.ts`            | `jsonOk` / `jsonError`                                                                            |
| `http/errors.ts`              | `ApiError`                                                                                        |
| `http/orval-mutator.ts`       | Orval fetch mutator → `apiClient`                                                                 |
| `query/`                      | QueryClient defaults, provider, `notifyApiError` / `notifySuccess`                                |
| `auth/session.ts`             | Placeholder session + `getClientSession()`                                                        |
| `store/app-shell-store.ts`    | Zustand shell (sidebar, theme, table density)                                                     |
| `providers/app-providers.tsx` | NuqsAdapter + Query + error boundary                                                              |
| `ui/`                         | PageShell, PageHeader, EmptyState, ErrorAlert, DrawerForm, ListToolbar, confirm, AppErrorBoundary |

## Rules

- **URL state** belongs in module `client/search-params.ts` (nuqs), not Zustand.
- **Zustand** is for session/shell prefs that should not be shareable. Reference: [`modules/users/ui/UsersPage.tsx`](../modules/users/ui/UsersPage.tsx) (`tableDensity` + selector hooks). Prefer `useAppShellStore((s) => s.field)` over subscribing to the whole store.
- **Toasts** use `notifyApiError` / `notifySuccess` (antd `message`), not a Zustand queue.
- **Do not wrap every Ant Design primitive** — only the listed UI kit pieces.
- Drawers for shareable flows; `confirmAction` for confirms that must not pollute history.
- Extend `getDefaultHeaders()` when real auth lands; keep token reading in `shared/auth`.
