# Build stage
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy workspace configuration
COPY package.json bun.lockb* ./
COPY tsconfig.json ./

# Copy packages (dependencies)
COPY packages ./packages

# Copy web app
COPY apps/web ./apps/web

# Install all dependencies (workspace setup)
RUN bun install --frozen-lockfile

# Build the web application
WORKDIR /app/apps/web
RUN bun run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]