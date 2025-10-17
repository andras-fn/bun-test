# Optimized React Web App Docker Image
# Multi-stage build for minimal production size

# Build stage - use Bun for fast builds
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy dependency files first for better Docker layer caching
COPY package.json bun.lockb* tsconfig.json ./

# Copy shared packages (database types, etc.)
COPY packages ./packages

# Copy web app source
COPY apps/web ./apps/web

# Install dependencies (including devDependencies for build)
# Install dependencies for build
RUN bun install --frozen-lockfile && \
    echo "Dependencies installed, starting build..."# Build the React application
WORKDIR /app/apps/web
RUN bun run build && \
    echo "Build completed, output size:" && \
    du -sh dist/ && \
    ls -la dist/

# Production stage - ultra-minimal nginx Alpine
FROM nginx:1.25-alpine AS production

# Install minimal security updates and remove package cache
RUN apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

# Copy built React app
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy optimized nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Security: run as non-root user
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 -G nginx-user && \
    chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/run && \
    # Test nginx configuration
    nginx -t

# Health check for the web server
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

USER nginx-user
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]