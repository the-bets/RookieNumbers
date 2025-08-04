# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the RookieNumbers project - a Go-based platform designed to help beginners invest, with the tagline "because we gotta pump those rookie numbers up."

## Project Structure

This is a full-stack application with Go backend and TypeScript frontend:

- `cmd/rookienumbers/` - Go backend API server (port 8080)
- `web/` - Next.js TypeScript frontend (port 3000)
- `pkg/` - Library code that can be imported by other projects
- `internal/` - Private application and library code

## Development Commands

### Running the Full Stack Application

**Backend (Go API server):**
```bash
go run cmd/rookienumbers/main.go
```

**Frontend (Next.js development server):**
```bash
cd web && npm run dev
```

**Run both simultaneously in separate terminals for full development experience.**

### Building the Application

**Backend:**
```bash
go build -o bin/rookienumbers cmd/rookienumbers/main.go
```

**Frontend:**
```bash
cd web && npm run build
```

### Testing

**Backend:**
```bash
go test ./...
```

**Frontend:**
```bash
cd web && npm test
```

### Code Formatting

**Backend:**
```bash
go fmt ./...
```

**Frontend:**
```bash
cd web && npm run lint
```

### Module Management

**Backend:**
```bash
go mod tidy    # Clean up dependencies
go mod vendor  # Create vendor directory
```

**Frontend:**
```bash
cd web && npm install  # Install dependencies
```

## Architecture Notes

This is a full-stack application with:

**Backend (Go):**
- HTTP server on port 8080
- CORS enabled for frontend communication
- API endpoints: `/` (welcome), `/api/health` (health check)
- Environment variables loaded from `.env` file
- API key management for external services

**Frontend (Next.js + TypeScript):**
- React-based frontend on port 3000
- Tailwind CSS for styling
- TypeScript for type safety
- Can communicate with Go backend via API calls

**Development Workflow:**
- Backend and frontend run separately in development
- Frontend makes HTTP requests to backend API
- CORS configured to allow localhost:3000 → localhost:8080 communication