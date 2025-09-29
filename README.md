# Orchestrator (Prisma-only)
- NestJS API (Prisma only), React web, BullMQ workers, GitHub PR flow, optional Claude Dev Notes, sandbox pattern.
- **2025 Update**: Enhanced GitHub integration with per-project tokens and GitHub App support.

## Quick start
```bash
# Start database and Redis
docker compose up -d db redis

# Install dependencies
pnpm i

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client and sync database
pnpm prisma:generate
pnpm prisma:push

# Start development services
pnpm -r -F api dev
pnpm -r -F worker dev
pnpm -r -F web dev
```

## Environment Configuration

### Required Environment Variables
```bash
# Database (adjust port if using Docker: 5433)
DATABASE_URL=postgres://postgres:postgres@localhost:5433/orchestrator

# Claude API
CLAUDE_API_KEY=sk-ant-...

# Redis (adjust port if using Docker: 6380)
REDIS_URL=redis://localhost:6380

# Global webhook secret for GitHub webhook verification
GITHUB_WEBHOOK_SECRET=your-webhook-secret
```

### GitHub Integration (2025 Enhanced)

**Recommended: GitHub App (Production)**
```bash
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
```

**Alternative: Legacy Token (Development Only)**
```bash
# Deprecated - use per-project tokens instead
GITHUB_TOKEN=ghp_xxx
```

## GitHub Integration Features

### Per-Project Authentication
- **Per-project GitHub tokens**: Each project can have its own fine-grained personal access token
- **GitHub App support**: Centralized GitHub App with installation-based authentication
- **Webhook security**: Per-project webhook secrets for enhanced security

### New API Endpoints
- `GET /github-installations` - List GitHub App installations
- `POST /github-installations` - Register new GitHub App installation
- `POST /projects/:id/repo/bind` - Bind repository with enhanced GitHub fields

### Project Repository Binding
Projects now support enhanced GitHub integration:
```json
{
  "repoProvider": "github",
  "repoUrl": "https://github.com/owner/repo",
  "githubWebhookSecret": "project-specific-secret",
  "githubAppInstallationId": "12345678",
  "githubTokenEncrypted": "encrypted-fine-grained-token"
}
```

## Development

### Build and Test
```bash
# Build API
cd apps/api && pnpm run build

# Test endpoints
node test-api.js
```

### Docker Development
```bash
# Full stack with Docker
docker compose up -d

# Build specific services
docker compose build api worker
```

### Troubleshooting

**ES Modules Issues**: The API uses CommonJS for compatibility. If you encounter module resolution errors, ensure `tsconfig.json` has `"module": "commonjs"`.

**Database Connection**: Use `localhost:5433` for local development when using Docker Compose.

**Missing Dependencies**: Install validation packages if needed:
```bash
cd apps/api && pnpm add class-validator class-transformer
```

## Architecture

- **Database**: PostgreSQL with Prisma ORM
- **API**: NestJS with enhanced GitHub integration
- **Frontend**: React with TypeScript
- **Workers**: BullMQ with Redis
- **Authentication**: GitHub App-first with fine-grained PAT fallback

> No TypeORM anywhere. Prisma-only stack with 2025-enhanced GitHub security.
