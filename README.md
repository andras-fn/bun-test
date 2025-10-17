# Todo App Monorepo

A modern full-stack todo application built with React, Hono, Better Auth, Drizzle ORM, PostgreSQL, and Bun. Features persistent login sessions, real-time todo management, and type-safe database operations.

## ✨ Tech Stack

- **Runtime & Package Manager**: Bun 1.3.0+ (native PostgreSQL client, environment variables)
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + TanStack Query + React Router v7
- **Backend**: Hono API server
- **Authentication**: Better Auth with email/password, secure cookie sessions
- **Database**: PostgreSQL + Drizzle ORM (using Bun's native SQL driver)
- **Development**: Vite proxy for seamless API integration, hot reload, TypeScript strict mode
- **Production**: Docker containers with nginx proxy for routing

## 🏗️ Project Structure

```text
bun-test/
├── apps/
│   ├── web/          # React frontend (Vite + Tailwind + React Router v7)
│   └── api/          # Hono API server (Better Auth + CORS)
├── packages/
│   ├── database/     # Drizzle ORM schemas (Bun SQL driver)
│   └── types/        # Shared TypeScript types
├── .env              # Environment variables (Bun native handling)
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3.0+
- [PostgreSQL](https://postgresql.org) v12+
- [Docker](https://docker.com) (optional, for PostgreSQL)

### 1. Installation

```bash
# Clone and install dependencies
git clone <your-repo-url>
cd bun-test
bun install
```

### 2. Database Setup (Choose One)

#### 🐳 Option A: Docker (Recommended)

```bash
# Start PostgreSQL container
docker run -d \
  --name todo-postgres \
  -e POSTGRES_DB=todoapp \
  -e POSTGRES_USER=todouser \
  -e POSTGRES_PASSWORD=todopass \
  -p 5432:5432 \
  postgres:latest

# Verify connection
docker exec -it todo-postgres psql -U todouser -d todoapp
```

#### 💻 Option B: Local PostgreSQL

```sql
-- Connect as postgres user
psql -U postgres

-- Create database and user
CREATE DATABASE todoapp;
CREATE USER todouser WITH ENCRYPTED PASSWORD 'todopass';
GRANT ALL PRIVILEGES ON DATABASE todoapp TO todouser;
```

### 3. Environment Setup

The project uses **Bun's native environment variable handling** - no dotenv needed!

```bash
# Copy the example environment file
cp .env.example .env

# The .env file contains:
DATABASE_URL="postgresql://todouser:todopass@localhost:5432/todoapp"
AUTH_SECRET="your-secret-key-here-change-in-production-min-32-chars"
# AUTH_BASE_URL="http://localhost:3001"      # Optional: auth server URL
# AUTH_TRUSTED_ORIGIN="http://localhost:5173" # Optional: trusted frontend origin
NODE_ENV="development"
PORT=3001
VITE_API_URL="http://localhost:3001"
```

**Environment Files:**

- `.env` - Local development configuration (with optional auth URLs)
- `.env.docker` - Docker/containerized configuration (with auth proxy settings)
- `.env.production.example` - Production deployment template (with HTTPS auth URLs)

### 4. Database Migration

```bash
# Run database migrations
cd packages/database
bun run migrate
```

### 5. Start Development Servers

Bun has excellent native support for running multiple workspace projects simultaneously:

```bash
# Start both frontend and backend concurrently (Recommended)
bun run dev
```

This uses Bun's `--filter '*' dev` to run the `dev` script in all workspace packages concurrently, providing a clean terminal UI for monitoring both servers.

**Alternative: Manual start in separate terminals:**

```bash
# Terminal 1: Start API server
bun run dev:api

# Terminal 2: Start web server  
bun run dev:web
```

**Services will be available at:**

- 🌐 **Frontend**: <http://localhost:5173> (Vite dev server with proxy)
- 🔧 **API**: <http://localhost:3001> (Hono API server)
- 📊 **Database Studio**: `bun run studio` (from packages/database)

## 🏗️ Development vs Production Architecture

### Development Setup (Vite Proxy + Bun Workspaces)

```text
Browser → Vite Dev Server (5173) → Proxy → Hono API (3001)
```

**Bun Workspace Benefits:**

- **Concurrent Execution**: `bun --filter '*' dev` runs both servers simultaneously
- **Visual Terminal UI**: Clean output monitoring for multiple processes
- **Intelligent Filtering**: Target specific packages with glob patterns
- **Hot Reload**: Both frontend and backend support live reloading
- **No CORS Issues**: Vite proxy handles all API requests seamlessly

### Production Setup (Docker + nginx)

```text
Browser → Nginx Proxy (3000) → {Web App (80) OR API Server (3001)}
                              ↓
                          PostgreSQL (5432)
```

**Docker Services:**

- **nginx proxy**: Routes requests, handles CORS, serves on port 3000
- **web**: React app served by nginx
- **api**: Hono server with Better Auth
- **postgres**: PostgreSQL database
- **migrate**: Automatic database migration on startup

## 🎯 Core Features

### ✅ Authentication & Session Management

- **Persistent Login Sessions**: 7-day cookie duration with auto-refresh
- **Email/Password Authentication**: Secure bcrypt hashing
- **Session Management**: HTTP-only cookies with CSRF protection
- **Better Auth Integration**: Modern authentication library with TypeScript support

### ✅ Todo Management

- **CRUD Operations**: Create, read, update, delete todos
- **Real-time Updates**: Optimistic UI updates with TanStack Query
- **Type Safety**: End-to-end TypeScript with Drizzle ORM schemas
- **Status Management**: Toggle completion status with immediate feedback

### ✅ Technical Excellence

- **Type Safety**: End-to-end TypeScript with strict mode
- **Database Migrations**: Version-controlled schema changes with Drizzle
- **Hot Reload**: Both frontend and backend support live development
- **Bun Native Features**: Built-in PostgreSQL driver, environment variables, workspace management
- **Modern React**: React Router v7 with declarative routing
- **Optimized Build**: Bun's fast bundler for production builds

## 🔧 Development Commands

```bash
# Development
bun run dev              # Start both servers concurrently
bun run dev:web          # Start only web server
bun run dev:api          # Start only API server

# Building
bun run build            # Build both web and API for production
bun run build:web        # Build only web app
bun run build:api        # Build only API server

# Database
bun run db:generate      # Generate new migrations
bun run db:migrate       # Run pending migrations
bun run db:push          # Push schema changes (dev only)
bun run db:studio        # Open Drizzle Studio

# Docker
bun run docker:up        # Start all services with auto-migration
bun run docker:down      # Stop all services
bun run docker:logs      # View container logs
```

## 📡 API Endpoints

### Authentication (Better Auth)

**Environment-Aware Configuration:**
- **Development**: Direct API connection (`http://localhost:3001`)
- **Docker/Production**: Through nginx proxy (`/api` routes)
- **Security**: Automatic secure cookies in production, CORS protection

**API Endpoints:**
- `POST /api/auth/sign-up/email` - Register new user
- `POST /api/auth/sign-in/email` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/session` - Get current session

**Auth Environment Variables:**
```bash
# Optional - automatically configured per environment
AUTH_BASE_URL="http://localhost:3001"        # Dev: direct API
AUTH_TRUSTED_ORIGIN="http://localhost:5173"  # Dev: Vite server
```

### Todos (Protected Routes)

- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## 💻 Code Examples

### Authentication Flow

```typescript
// Frontend auth client (uses Better Auth)
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL: "http://localhost:3001",
  credentials: "include",
});
```

### Database Integration

```typescript
// Using Bun's native PostgreSQL driver with Drizzle
import { drizzle } from "drizzle-orm/bun-sql";

// Use Bun's native SQL client (no external drivers needed)
const sql = new SQL(process.env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
```

### Environment Variables (Bun Native)

```typescript
// Bun automatically loads .env files - no dotenv needed!
const config = {
  port: process.env.PORT || 3001,
  dbUrl: process.env.DATABASE_URL,
  authSecret: process.env.AUTH_SECRET,
};
```

## 🐳 Docker Deployment

### Full Stack with Docker Compose

```bash
# Build and start all services
bun run docker:up

# Services available at:
# - http://localhost:3000 (nginx proxy)
# - Frontend and API automatically routed
```

**Docker Architecture:**

The Docker setup includes:

- **PostgreSQL**: Database service with persistent volume
- **API Server**: Hono backend with Better Auth and Bun's native PostgreSQL driver (~110MB optimized image)
- **Web App**: React frontend with Router v7 built and served by nginx (~40MB optimized image)
- **nginx Proxy**: Reverse proxy and static file server with React Router v7 support
- **Migration**: Automatic database schema deployment using Drizzle (~80MB optimized image)

**🚀 Docker Image Optimizations:**

Our Docker images are highly optimized for production:

| Service | Base Image | Size | Optimization Strategy |
|---------|------------|------|---------------------|
| **API** | `bun:1.3-alpine` | ~110MB | Bundled JavaScript, aggressive cleanup, non-root user |
| **Web** | `nginx:alpine` | ~40MB | Multi-stage build, minimal nginx, security hardening |
| **Migration** | `bun:1.3-alpine` | ~80MB | Production deps only, single-purpose container |

**Key Optimizations Applied:**
- ✅ **Bundling over Compilation**: JavaScript bundling works better than static compilation
- ✅ **Multi-stage Builds**: Separate build and runtime environments
- ✅ **Aggressive Cleanup**: Remove caches, docs, and temporary files
- ✅ **Non-root Users**: Security hardening for all services
- ✅ **Health Checks**: Proper container monitoring and restart policies

**nginx Configuration:**
- `nginx/nginx.conf` - Main proxy configuration (used by docker-compose)
- `apps/web/nginx.conf` - Web container nginx configuration for static files

### Manual Docker Commands

```bash
# Start PostgreSQL only
docker-compose up postgres

# Build and run specific service
docker-compose up --build api

# View logs
docker-compose logs -f api
```

## ⚙️ Configuration Files

### Environment Variables

```bash
# .env (development)
DATABASE_URL="postgresql://todouser:todopass@localhost:5432/todoapp"
AUTH_SECRET="your-secret-key-min-32-chars"
NODE_ENV="development"
PORT=3001
VITE_API_URL="http://localhost:3001"
```

**⚠️ Important:**

- Change `AUTH_SECRET` before production deployment
- Use strong, unique secrets in production
- Never commit real secrets to version control

### Drizzle Configuration

```typescript
// packages/database/drizzle.config.ts
export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Vite Proxy Configuration

```typescript
// apps/web/vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

## 🔒 Security Features

- **HTTP-only Cookies**: Session tokens not accessible via JavaScript
- **CSRF Protection**: Built into Better Auth
- **CORS Configuration**: Proper origin handling for cross-domain requests
- **Password Hashing**: bcrypt with proper salt rounds
- **Environment Isolation**: Separate configurations for dev/prod

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors:**

- Verify PostgreSQL is running: `docker ps` or `pg_isready`
- Check DATABASE_URL in .env file
- Ensure database and user exist

**Build Errors:**

- Run type check: `bun run type-check`
- Clear node_modules: `rm -rf node_modules && bun install`
- Check for TypeScript errors in IDE

**Authentication Issues:**

- Verify AUTH_SECRET is set and >= 32 characters
- Check browser cookies (should see better-auth session)
- Ensure API and frontend URLs match in configuration

### Debug Commands

```bash
# Check all services
docker-compose ps

# View API logs
bun run docker:logs api

# Test database connection
bun run --filter database migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Built with ❤️ using Bun's native capabilities and modern web technologies

## 📚 Additional Resources

### Bun-Native Development

- **PostgreSQL Driver**: Uses Bun's built-in SQL client (no external drivers needed)
- **Environment Variables**: Native .env support without dotenv
- **Package Management**: Fast installs and workspace support
- **TypeScript**: Built-in TypeScript support with Bun runtime
- **Hot Reload**: Native watch mode for development servers

### Framework Documentation

- [Bun Documentation](https://bun.sh/docs)
- [React Router v7](https://reactrouter.com/en/7.0.0)
- [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://www.better-auth.com)
- [Hono Framework](https://hono.dev)
- [TanStack Query](https://tanstack.com/query)