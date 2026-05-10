# Smart Traffic Management System

Production-ready Smart City traffic control platform with:
- React + Vite frontend (SaaS-quality responsive UI)
- Express + Prisma backend
- PostgreSQL data layer
- Socket.IO real-time event pipeline
- Mock simulator for live traffic/emergency streams

## 1) Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm 10+

## 2) Environment Configuration

Create these files:

1. `backend/.env`
2. `frontend/.env` (optional for custom API/socket URLs)

Use templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend required values:
- `DATABASE_URL=postgresql://<user>:<password>@localhost:5432/traffic_management`
- `CLIENT_URLS=http://localhost:5173`

## 3) Dependency Installation

```bash
npm run install:all
```

Or manual:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

## 4) Database Setup (Prisma + PostgreSQL)

```bash
npm run db:migrate
npm run db:seed
```

For production migration:

```bash
npm run db:deploy
```

## 5) Local Startup (Full System)

Run backend + frontend together:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5000/api`  
Health endpoint: `http://localhost:5000/health`

## 6) Real-Time Simulation

Mock real-time simulator is enabled by default from backend env:
- `SIMULATOR_ENABLED=true`
- `SIMULATOR_INTERVAL_MS=5000`

It continuously emits:
- `traffic-update`
- `signal-change`
- `incident-report`
- `emergency-alert`
- `system-health-update`
- `junction-status-update`

## 7) Production Build + Run

```bash
npm --prefix frontend run build
npm --prefix backend run start:prod
```

Backend includes:
- CORS allowlist via `CLIENT_URLS`
- Helmet security headers
- Compression
- Rate limiting
- Graceful shutdown

## 8) Docker Deployment

Use the included `docker-compose.yml`:

```bash
docker compose up --build -d
```

Services:
- `db` (PostgreSQL)
- `backend` (Express + Socket.IO + Prisma)
- `frontend` (Nginx serving built React app with API proxy)

## 9) Scalability Notes

- Stateless backend API for horizontal scaling
- Socket.IO ready for adapter-based scaling (Redis adapter can be plugged in)
- Indexed Prisma schema for high-frequency traffic queries
- Frontend split build artifacts via Vite
- API route segmentation by domain modules (`traffic`, `incident`, `analytics`, `system-health`)
