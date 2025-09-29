#!/bin/bash

# Claude Code Startup Script for DevContainer
# Enables --dangerously-skip-permissions for secure container environment

set -e

echo "🤖 Starting Claude Code in DevContainer..."

# Check if Claude Code is installed
if ! command -v claude-code &> /dev/null; then
    echo "⚠️  Claude Code not found, installing..."
    npm install -g @anthropic-ai/claude-code@latest
fi

# Create Claude Code configuration directory
mkdir -p ~/.config/claude-code

# Create Claude Code configuration file
cat > ~/.config/claude-code/config.json << EOF
{
  "dangerouslySkipPermissions": true,
  "allowedPaths": [
    "/app",
    "/workspace",
    "/workspaces"
  ],
  "containerEnvironment": true,
  "secureMode": true
}
EOF

echo "📝 Claude Code configuration created"

# Set environment variables for Claude Code
export CLAUDE_CODE_SKIP_PERMISSIONS=true
export CLAUDE_CODE_CONTAINER_MODE=true
export CLAUDE_CODE_WORKSPACE_ROOT=/app

# Add to shell profile for persistence
echo 'export CLAUDE_CODE_SKIP_PERMISSIONS=true' >> ~/.zshrc
echo 'export CLAUDE_CODE_CONTAINER_MODE=true' >> ~/.zshrc
echo 'export CLAUDE_CODE_WORKSPACE_ROOT=/app' >> ~/.zshrc

# Create wrapper script for Claude Code with permissions flag
cat > /usr/local/bin/claude-code-secure << 'EOF'
#!/bin/bash
exec claude-code --dangerously-skip-permissions "$@"
EOF

chmod +x /usr/local/bin/claude-code-secure

echo "✅ Claude Code configured with --dangerously-skip-permissions"
echo "🔐 Running in secure container environment"
echo ""
echo "Usage:"
echo "  claude-code-secure [options]    # Start Claude Code with permissions skipped"
echo "  claude-code --help              # Show Claude Code help"
echo ""
echo "🚀 Claude Code is ready for use in the DevContainer!"

# Optionally start Claude Code immediately
if [ "$1" = "--start" ]; then
    echo "🚀 Starting Claude Code..."
    claude-code-secure
fi