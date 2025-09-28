# Claude Orchestrator MVP

A minimal monorepo (NestJS API + React/Vite web) for managing projects, repo bootstrap, sub-agent templates, document versions, story approvals, and artifacts.

## Quick start

### 1) Prereqs
- Node 20+ and pnpm 9+
- Docker Desktop (for Postgres)
- Windows-friendly (paths are normalized).

### 2) Start Postgres
```bash
docker compose up -d
```

### 3) Install deps
```bash
pnpm i
```

### 4) Launch API and Web
```bash
pnpm -r -F api dev
pnpm -r -F web dev
```
- API: http://localhost:4000
- Web: http://localhost:5173

### 5) Seed sample data (optional)
```bash
pnpm -r -F api seed
```

> MVP mode uses TypeORM `synchronize: true` to get you moving fast. For prod, switch to migrations.

## Notes
- Sub-agent templates: project-scoped under `.claude/agents/*.md` (committed).
- Repo bootstrap is stubbed to be idempotent. Flip a project toggle to mark `repo_ready` once verified.
- This is an MVP—extend modules and DB entities as needed.
## Env
Create `.env` at repo root (copy `.env.example`) and set:
- `DATABASE_URL=postgres://postgres:postgres@localhost:5432/orchestrator`
- `CLAUDE_API_KEY=sk-ant-...` (Claude Code)
- `GITHUB_WEBHOOK_SECRET=your-shared-secret` (optional for dev)

## Orchestrator (MVP)
- Story worker polls every 60s for APPROVED stories with dependencies met and project.repo_ready, then simulates a dev run and posts Dev Notes (Markdown) and a fake PR record.
- PR review worker polls every 60s for OPEN PRs and simulates a review outcome.

To run workers:
```bash
pnpm -r -F worker dev
```


## V3 Upgrades
- **Prisma-only API** (TypeORM removed from runtime paths)
- **BullMQ queues** (Redis): `dev` and `review` with interval enqueuers and workers
- **GitHub PR flow (real)** using `GITHUB_TOKEN`:
  - Creates a new branch from default branch
  - Commits a Dev Notes markdown file (via GitHub Contents API)
  - Opens a PR; review worker auto-approves and merges (demo)

### Quick Start (10 min)
```bash
docker compose up -d
pnpm i
pnpm prisma:generate
pnpm prisma:push
pnpm -r -F api dev
pnpm -r -F worker dev
pnpm -r -F web dev
```

**Provide a GitHub token** (classic or fine-grained) with repo write on the project repo:
```
export GITHUB_TOKEN=ghp_xxx   # or set in docker-compose .env
```


## Claude Code "YOLO" sandbox pattern
This compose file includes a **sandbox image** (`claude-sandbox:latest`) and mounts the Docker socket into the worker **read-only** so it can launch **ephemeral, locked-down containers** for risky operations.

- Worker env:
  - `SANDBOX_IMAGE` (default `claude-sandbox:latest`)
  - `SANDBOX_WORKDIR` (default `/workspace`)
  - `SANDBOX_NETWORK` (default `none` for no egress)
- Volumes:
  - `workspaces:` mounted at `/workspaces` (host-side), the worker can bind a per-run folder into the sandbox at `/workspace`.
- Example usage available in `apps/worker/src/sandbox.ts`; call `runInSandbox({ cmd: ['bash','-lc','...'], bindWorkspace: '/workspaces/projectX' })`.

> This does **not** expose your host filesystem to the subagent. Only allow-listed mounts are provided per run. Keep `NetworkMode: 'none'` unless you explicitly need egress to specific services.

### Building the sandbox base image
```bash
docker compose --profile builder build sandbox-image
```
