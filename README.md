# next-app

Next.js App Router app with TypeScript, Tailwind, Prisma, and Postgres.

## Setup

```bash
pnpm install
docker compose up -d
pnpm prisma migrate dev
pnpm dev
```

Open http://localhost:3000. `GET /api/health` returns `{ "ok": true }` when Postgres is up.

Copy `.env.example` to `.env.local` if you need to change `DATABASE_URL`. The local default is:

```
postgresql://nextapp:nextapp@localhost:5432/nextapp
```

Node 22 is pinned with Volta. pnpm is pinned in `packageManager`.
