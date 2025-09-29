# Orchestrator (Prisma-only)
- NestJS API (Prisma only), React web, BullMQ workers, GitHub PR flow, optional Claude Dev Notes, sandbox pattern.

## Quick start
```bash
docker compose up -d
pnpm i
pnpm prisma:generate
pnpm prisma:push
pnpm -r -F api dev
pnpm -r -F worker dev
pnpm -r -F web dev
```

Set env:
```
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/orchestrator
export REDIS_URL=redis://localhost:6379
export GITHUB_TOKEN=ghp_xxx
export CLAUDE_API_KEY=sk-ant-...
```

Build sandbox image (optional):
```bash
docker compose --profile builder build sandbox-image
```

> No TypeORM anywhere. Prisma-only stack.
