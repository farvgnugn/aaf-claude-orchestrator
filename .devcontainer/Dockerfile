FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    bash \
    zsh \
    curl \
    wget \
    python3 \
    make \
    g++ \
    linux-headers \
    docker \
    docker-compose \
    sudo

# Create vscode user
RUN addgroup -g 1000 vscode && \
    adduser -u 1000 -G vscode -s /bin/zsh -D vscode && \
    echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Install pnpm and enable corepack
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Install Claude Code globally
RUN npm install -g @anthropic-ai/claude-code@latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Generate Prisma client
RUN pnpm prisma:generate

# Copy devcontainer scripts
COPY .devcontainer/init-firewall.sh /.devcontainer/init-firewall.sh
COPY .devcontainer/start-claude.sh /.devcontainer/start-claude.sh
RUN chmod +x /.devcontainer/init-firewall.sh /.devcontainer/start-claude.sh

# Copy application code
COPY . .

# Change ownership to vscode user
RUN chown -R vscode:vscode /app

# Switch to vscode user
USER vscode

# Run Claude setup script
RUN /.devcontainer/start-claude.sh

# Set up shell environment
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true

# Expose ports
EXPOSE 4000

# Default command
CMD ["tail", "-f", "/dev/null"]