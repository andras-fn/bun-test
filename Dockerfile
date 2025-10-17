# Use Bun 1.3 Alpine image
FROM oven/bun:1.3-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN bun install --frozen-lockfile

# Build the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules

# Copy source code
COPY . .

# Set production environment for web build
ENV NODE_ENV=production
ENV VITE_API_URL=http://localhost:3001

# Build applications
RUN bun run build:web
RUN bun run build:api

# Production image, copy only production files
FROM oven/bun:1.3-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Create non-root user
RUN addgroup --system --gid 1001 bungroup
RUN adduser --system --uid 1001 bunuser

# Copy built applications
COPY --from=builder --chown=bunuser:bungroup /app/apps/api/dist ./api/
COPY --from=builder --chown=bunuser:bungroup /app/apps/web/dist ./web/
COPY --from=builder --chown=bunuser:bungroup /app/packages ./packages/

# Copy package.json for production dependencies
COPY --from=builder --chown=bunuser:bungroup /app/apps/api/package.json ./api/
COPY --from=deps --chown=bunuser:bungroup /app/apps/api/node_modules ./api/node_modules/

USER bunuser

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun -e "fetch('http://localhost:3001/health').then(r => r.ok ? process.exit(0) : process.exit(1))" || exit 1

CMD ["bun", "run", "api/index.js"]