# Claude Code DevContainer Setup

This devcontainer provides a secure, isolated environment for running Claude Code with the `--dangerously-skip-permissions` flag in a controlled Docker container.

## 🚀 Quick Start

### Prerequisites
- [VS Code](https://code.visualstudio.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Setup Instructions

1. **Open in VS Code**
   ```bash
   code .
   ```

2. **Reopen in Container**
   - VS Code will detect the devcontainer configuration
   - Click "Reopen in Container" when prompted
   - Or use Command Palette: `Remote-Containers: Reopen in Container`

3. **Wait for Container Build**
   - First build takes 5-10 minutes
   - Subsequent builds are much faster due to caching

## 🔐 Security Features

### Network Isolation
- Custom firewall rules restrict outbound network access
- Only essential services are allowed (DNS, HTTP/HTTPS for packages)
- Local network access permitted for development

### Permission Management
- Claude Code runs with `--dangerously-skip-permissions` flag
- Only safe in isolated container environment
- File system access limited to `/app` workspace

### Container Security
- Non-root user (`vscode`) for development
- Docker socket access for container operations
- Privileged mode only for firewall management

## 🛠️ Using Claude Code

### Start Claude Code
```bash
# In the devcontainer terminal:
claude-code-secure

# Or manually with options:
claude-code --dangerously-skip-permissions
```

### Environment Variables
The following environment variables are automatically set:
- `CLAUDE_CODE_SKIP_PERMISSIONS=true`
- `CLAUDE_CODE_CONTAINER_MODE=true`
- `CLAUDE_CODE_WORKSPACE_ROOT=/app`

## 📊 Available Services

| Service | Port | Description |
|---------|------|-------------|
| API | 4000 | NestJS API Server |
| PostgreSQL | 5433 | Database |
| Redis | 6380 | Cache/Queue |

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Start API development server
cd apps/api && pnpm dev

# Start Worker
cd apps/worker && pnpm dev

# Database operations
pnpm prisma:generate
pnpm prisma:push

# Run Claude Code
claude-code-secure
```

## ⚠️ Important Security Notes

1. **Only use with trusted repositories** - The `--dangerously-skip-permissions` flag bypasses security checks
2. **Container isolation is critical** - This setup is only safe because of the Docker container isolation
3. **Monitor Claude's activities** - Always review what Claude is doing in the container
4. **Network restrictions** - Firewall rules prevent unauthorized network access

## 🐛 Troubleshooting

### Container Build Issues
```bash
# Rebuild container from scratch
docker-compose -f docker-compose.devcontainer.yml build --no-cache
```

### Claude Code Installation Issues
```bash
# Reinstall Claude Code
npm install -g @anthropic-ai/claude-code@latest

# Or run setup script manually
/.devcontainer/start-claude.sh
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R vscode:vscode /app
```

### Firewall Issues
```bash
# Reinitialize firewall
sudo /.devcontainer/init-firewall.sh
```

## 📁 File Structure

```
.devcontainer/
├── devcontainer.json       # VS Code devcontainer configuration
├── Dockerfile             # Custom container image
├── init-firewall.sh       # Network security setup
├── start-claude.sh        # Claude Code initialization
└── README.md              # This file

docker-compose.devcontainer.yml  # Container orchestration
```

## 🔄 Updates

To update Claude Code:
```bash
npm install -g @anthropic-ai/claude-code@latest
```

To update the devcontainer:
- Rebuild the container in VS Code
- Or run: `docker-compose -f docker-compose.devcontainer.yml build`

## 🤝 Contributing

When working with this devcontainer:
1. All changes should be made within the container
2. Use the provided VS Code extensions for best experience
3. Test changes in the isolated environment
4. Commit changes from within the container

---

**Security Reminder**: This configuration enables `--dangerously-skip-permissions` which should only be used in trusted, isolated environments like this devcontainer.