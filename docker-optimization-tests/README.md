# Docker Optimization Test Results

This folder contains all the Dockerfile variations tested during our Docker image optimization research.

## Test Results Summary

| Dockerfile | Image Size | Status | Notes |
|------------|------------|--------|-------|
| `Dockerfile.test2-baseline-musl` | **120MB** | ✅ **WINNER** | Best balance of size + reliability |
| `Dockerfile.test5-scratch` | 98.4MB | ❌ | Smallest but crashes (missing runtime libs) |
| `Dockerfile.test6-max-optimization` | 108MB | ❌ | Small but bytecode compilation issues |
| `Dockerfile.test1-modern-musl` | 233MB | ✅ | Works but bytecode overhead makes it large |
| `Dockerfile.test3-modern-glibc` | 192MB | ✅ | Works with Debian/glibc but larger |

## Key Learnings

### 🏆 Winning Strategy: Baseline + musl
- **Target**: `bun-linux-x64-musl-baseline`
- **Runtime**: Alpine Linux (musl libc)
- **Optimizations**: `--minify`, `--bytecode`
- **Result**: 120MB, fully functional

### Failed Approaches
1. **Scratch containers**: Missing essential C++ runtime libraries
2. **Heavy bytecode optimization**: Can cause startup issues
3. **glibc targets**: Work but create larger images than musl
4. **UPX compression**: Breaks Bun executables

### Target Comparison
- **baseline**: Better compatibility, smaller size
- **modern**: Better performance, larger size  
- **musl**: Smaller runtime footprint than glibc
- **glibc**: Broader compatibility but larger

## File Descriptions

### Compilation Tests
- `Dockerfile.test1-modern-musl` - Modern CPU + musl + bytecode
- `Dockerfile.test2-baseline-musl` - **WINNER**: Baseline CPU + musl + optimizations  
- `Dockerfile.test3-modern-glibc` - Modern CPU + Debian/glibc
- `Dockerfile.test4-distroless-musl` - Distroless security approach
- `Dockerfile.test5-scratch` - Minimal scratch container attempt
- `Dockerfile.test6-max-optimization` - All optimization flags

### Development/Debug Versions
- `Dockerfile.compiled-debug` - Debug version with extensive logging
- `Dockerfile.compiled-alpine` - Basic Alpine compilation
- `Dockerfile.compiled-final` - Production Alpine version
- `Dockerfile.compiled-hyper` - Hyper-optimization attempt
- `Dockerfile.compiled-minimal` - Minimal runtime attempt
- `Dockerfile.compiled-optimized` - UPX compression test (broken)
- `Dockerfile.compiled-production` - Production best practices
- `Dockerfile.compiled-small` - Size-focused optimization
- `Dockerfile.compiled-ultra` - Ultra optimization with stripping

## Usage

To build any test version:
```bash
docker build -f docker-optimization-tests/Dockerfile.test2-baseline-musl -t my-test .
```

## Production Recommendation

Use `../Dockerfile.optimal` (based on `test2-baseline-musl`) for production deployments.