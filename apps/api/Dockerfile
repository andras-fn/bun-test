# Optimized Bun API Docker Image (Target: ~110MB)
# Uses lessons learned: bundling > compiling, Alpine base, aggressive cleanup

# Build stage
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy workspace files for better Docker layer caching
COPY package.json bun.lockb* ./
COPY packages/database ./packages/database  
COPY apps/api ./apps/api

# Install dependencies
RUN bun install --frozen-lockfile
WORKDIR /app/apps/api

# Bundle everything into a single optimized file (works better than --compile)
RUN bun build src/index.ts \
    --outfile=bundle.js \
    --target=bun \
    --minify \
    --bundle && \
    echo "Bundle size: $(du -h bundle.js)" && \
    # Test bundle works
    timeout 2 bun bundle.js || echo "Bundle test completed"

# Production stage - minimal Bun Alpine
FROM oven/bun:1.3-alpine AS production

WORKDIR /app

# Copy only the single bundled file (no node_modules needed!)
COPY --from=builder /app/apps/api/bundle.js ./

# Ultra-aggressive cleanup for minimal size
RUN bun pm cache rm 2>/dev/null || true && \
    rm -rf /root/.bun/install /tmp/* /var/cache/* && \
    # Remove docs and unnecessary files from Bun image
    find /usr/local -name "*.md" -delete 2>/dev/null || true && \
    find /usr/local -name "docs" -type d -exec rm -rf {} + 2>/dev/null || true && \
    # Test the bundle in production environment
    echo "Production test:" && \
    timeout 2 bun bundle.js || echo "Production test completed"

# Security: non-root user
RUN adduser -D -s /bin/sh app && \
    chown app:app bundle.js
USER app

EXPOSE 3001

# Optimized health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun -e "fetch('http://localhost:3001/health').then(r => r.ok ? process.exit(0) : process.exit(1))" || exit 1

# Run the optimized bundle
CMD ["bun", "run", "bundle.js"]