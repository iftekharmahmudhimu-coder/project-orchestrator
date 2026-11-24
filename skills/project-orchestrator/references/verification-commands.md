# Verification Commands by Stack

## Node.js / TypeScript
```bash
# Install
npm ci

# Lint
npm run lint          # eslint . --ext .ts,.tsx
npm run format:check  # prettier --check .

# Type-check
npm run typecheck     # tsc --noEmit

# Unit tests
npm run test:unit     # vitest run / jest

# Component tests
npm run test:components # vitest run --environment=jsdom

# E2E tests
npm run test:e2e      # playwright test / cypress run

# Full suite
npm run test:all      # runs all above

# Build
npm run build         # tsc && vite build / next build

# Dev server
npm run dev           # vite / next dev / nodemon
```

## Python
```bash
# Install
pip install -e .[dev]  # or poetry install

# Lint
ruff check .
black --check .

# Type-check
mypy .

# Tests
pytest -xvs            # unit + integration
pytest -xvs -m e2e     # e2e only

# Build
python -m build        # wheel + sdist
```

## Go
```bash
# Deps
go mod tidy

# Lint
golangci-lint run

# Type-check (built-in)
go vet ./...

# Tests
go test ./... -v
go test ./... -race -coverprofile=coverage.out

# Build
go build -o bin/app ./cmd/app
```

## Rust
```bash
# Lint
cargo clippy -- -D warnings

# Format
cargo fmt --check

# Tests
cargo test --all-targets

# Build
cargo build --release
```

## Docker (All Stacks)
```bash
# Build
docker build -t project .

# Run tests in container
docker run --rm project npm run test:all

# Smoke test
docker run --rm -d -p 3000:3000 --name smoke project
sleep 5
curl -f http://localhost:3000/health || exit 1
docker stop smoke
```

## Phase-Gate Commands (Run After Each Phase)

| Phase | Command |
|-------|---------|
| 0-1 | `npm run build && npm run lint` |
| 2-3 | `npm run typecheck && npm run test:unit` |
| 4 | `npm run test:components && npm run build` |
| 5 | `npm run test:e2e && npm run test:all` |
| 6 | `docker build -t project . && docker run --rm project npm run smoke-test` |

**Customize per project:** Read `package.json` scripts, `Makefile`, `justfile`, `Taskfile.yml`, or `pyproject.toml` for actual commands.