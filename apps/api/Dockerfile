# Use Bun 1.3 Alpine image (smallest possible)
FROM oven/bun:1.3-alpine

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY package.json bun.lockb* ./

# Copy packages (dependencies)
COPY packages ./packages

# Copy API package
COPY apps/api ./apps/api

# Install all dependencies (workspace setup)
RUN bun install --frozen-lockfile

# Build the API application
WORKDIR /app/apps/api
RUN bun run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun -e "fetch('http://localhost:3001/health').then(r => r.ok ? process.exit(0) : process.exit(1))" || exit 1

# Start the application
CMD ["bun", "run", "dist/index.js"]