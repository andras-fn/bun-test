# Dockerfile Guide

## Production Dockerfiles

| File | Purpose | Size | Status | When to Use |
|------|---------|------|--------|-------------|
| `Dockerfile` | **Compiled executable (OPTIMAL)** | 120MB | ✅ **BEST** | Single binary, production deployment |
| `apps/api/Dockerfile` | **Bundled with Bun runtime** | 112MB | ✅ Alternative | Development, complex dependencies |
| `apps/web/Dockerfile` | **React frontend + nginx** | ~25MB | ✅ Frontend | Web application serving |

## Recommendations

### Use `Dockerfile` (Compiled) when:
- ✅ **Production deployment** (recommended default)
- ✅ Single binary distribution needed
- ✅ Minimal runtime dependencies desired  
- ✅ Maximum startup performance needed
- ✅ Air-gapped or embedded environments

### Use `apps/api/Dockerfile` (Bundled) when:
- ✅ Active development and debugging
- ✅ Complex npm dependencies with native modules
- ✅ Dynamic imports or runtime code generation
- ✅ Need full Bun runtime features

## Architecture Options

### 🐳 **Docker Compose** (Recommended)
```bash
docker-compose up  # Uses individual service Dockerfiles
```
- Separate containers for API, web, database, proxy
- Better scalability and maintenance
- Service isolation and independent updates

### 📦 **Monorepo Build** (Alternative)
```bash
docker build -f docker-optimization-tests/Dockerfile.monorepo-combined .
```
- Single container with both API and web
- Simpler deployment but less flexible

## Test Archive

See `docker-optimization-tests/` for:
- **`DOCKER_OPTIMIZATION_RESULTS.md`** - Complete analysis and benchmarks  
- All experimental Dockerfiles from our optimization testing
- Historical approaches and lessons learned

## Build Commands

```bash
# Production compiled executable (recommended)
docker build -t my-api .

# Development bundled version
docker build -f apps/api/Dockerfile -t my-api-dev .

# Full stack with compose
docker-compose up --build
```