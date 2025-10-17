# OPTIMAL: Bun compiled executable - 120MB final size
# Uses baseline CPU target + musl + bytecode for best size/compatibility balance

FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy package files for dependency resolution
COPY package.json bun.lockb* ./
COPY packages/database ./packages/database
COPY apps/api ./apps/api

# Install all dependencies (needed for TypeScript compilation)
RUN bun install --frozen-lockfile

WORKDIR /app/apps/api

# Optimal compilation settings based on testing:
# - baseline: Better compatibility + smaller size than modern
# - musl: Matches Alpine runtime, smaller than glibc  
# - bytecode: Faster startup time
# - minify: Code size reduction
RUN echo "=== Optimal Compilation: baseline + musl + bytecode ===" && \
    bun build src/index.ts \
    --compile \
    --outfile=app \
    --target=bun-linux-x64-musl-baseline \
    --minify \
    --bytecode \
    --define:process.env.NODE_ENV=\"production\" \
    --define:DEBUG=\"false\" \
    --asset-naming="[name].[ext]" && \
    chmod +x app && \
    echo "Final executable size: $(du -h app)"

# Minimal Alpine runtime with essential C++ libraries
FROM alpine:3.19

# Install minimal C++ runtime (required for Bun executables)
# Remove all unnecessary packages and cache
RUN apk add --no-cache libstdc++ libgcc && \
    rm -rf /var/cache/apk/* /tmp/* /var/tmp/* && \
    adduser -D -s /sbin/nologin -u 1000 app

WORKDIR /app

# Copy the optimized executable
COPY --from=builder /app/apps/api/app ./app

# Set minimal ownership (no chmod needed, already set in builder)
USER 1000

# Health check for production readiness
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD timeout 5 wget -qO- http://localhost:3001/health || exit 1

EXPOSE 3001

# Direct execution (no shell, no init system needed for simple apps)
CMD ["./app"]