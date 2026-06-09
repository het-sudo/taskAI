# ⚡ TaskFlow
> 🚀 Full-Stack Task Management & Collaboration Platform

---

## 1. 📋 Executive Summary

TaskFlow is a full-stack task management and collaboration platform built with modern web technologies. It features secure JWT authentication with refresh token rotation, real-time notifications via Socket.IO, Redis-backed token blacklisting, and a feature-based React frontend architecture.

The system is designed for medium-to-advanced complexity use cases and serves as a strong portfolio demonstration of production-grade engineering patterns.

---

## 2. 🛠️ Technology Stack

### 2.1 🎨 Frontend

| Package | Version |
|---|---|
| ⚛️ React | 19.2.5 |
| 🔷 TypeScript | 6 |
| ⚡ Vite | 8 |
| 🐻 Zustand | State Management |
| 📝 React Hook Form | Form Handling |
| 🛡️ Zod | Schema Validation |
| 🌐 Axios | HTTP Client |
| 🔌 Socket.IO Client | Real-time Communication |

### 2.2 ⚙️ Backend

| Package | Version / Role |
|---|---|
| 🚂 Express | 5.2.1 |
| 🔺 Prisma ORM | 6.7.0 |
| 🐘 PostgreSQL | Primary Database |
| 🔑 JWT | Authentication |
| 🔒 bcrypt | Password Hashing |
| 🟥 Redis (ioredis) | Token Blacklist |
| 🔌 Socket.IO | Real-time Events |
| 📜 Winston | Logging |

---

## 3. 🏗️ High-Level Architecture

The React client communicates with the Express API via Axios (HTTP) and Socket.IO (WebSocket). The API layer handles all business logic and persists data to PostgreSQL via Prisma ORM. Redis is used exclusively for fast token blacklisting during logout and session invalidation.

```text
React Client
     |
 Axios (HTTP) + Socket.IO (WebSocket)
     |
Express API
     |
+----+--------------------+
|                         |
v                         v
PostgreSQL              Redis
(Prisma ORM)        (Token Blacklist)
```

---

## 4. 📁 Project Structure

### 4.1 🎨 Frontend Structure

```text
client/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   ├── task/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   ├── axios/
│   │   │   ├── appLayout/
│   │   │   └── types/
│   │   ├── notification/
│   │   └── dashboard/
│   ├── routes/
│   ├── app.tsx
│   └── main.tsx
├── public/
├── package.json
└── vite.config.ts
```

| Folder | Responsibility |
|---|---|
| 🔐 auth | Authentication UI & logic |
| ✅ task | Task Management |
| 🧩 shared/components | Reusable UI components |
| 🪝 shared/hooks | Reusable custom hooks |
| 🌐 shared/api | Shared API call helpers |
| 📡 shared/axios | Axios instance & interceptors |
| 🖼️ shared/appLayout | Application layout wrappers |
| 🔷 shared/types | Shared TypeScript types |
| 🔔 notification | Notification Center |
| 📊 dashboard | Dashboard Analytics |
| 🗺️ routes | Route Definitions |
| 🏠 app.tsx | Root application component |
| 🚀 main.tsx | Application entry point |

### 4.2 ⚙️ Backend Structure

```text
server/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   └── validators/
│   │   ├── task/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   └── validators/
│   │   ├── notification/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   └── validators/
│   │   └── dashboard/
│   │       ├── controllers/
│   │       ├── services/
│   │       └── routes/
│   ├── middleware/
│   ├── sockets/
│   ├── configs/
│   ├── lib/
│   ├── constants/
│   ├── utils/
│   ├── types/
│   └── app.ts
├── package.json
└── tsconfig.json
```

| Folder | Responsibility |
|---|---|
| 📦 modules/ | Feature-grouped domain modules |
| 🎮 modules/*/controllers | Handle HTTP requests & responses |
| 🧠 modules/*/services | Business logic |
| 🛤️ modules/*/routes | API endpoint definitions |
| 🛡️ modules/*/validators | Zod schemas for that module |
| 🔒 middleware | Auth middleware & global validation |
| 🔌 sockets | Realtime Socket.IO communication |
| ⚙️ configs | Environment & service configurations |
| 📚 lib | Third-party client setup (Redis, Prisma, etc.) |
| 📌 constants | App-wide constant values |
| 🔧 utils | Shared utility functions |
| 🔷 types | Shared TypeScript types |
| 🗄️ prisma | Database schema & migrations |

---

## 5. 🗄️ Database Schema

### 5.1 📊 Models Overview

| Model | Purpose |
|---|---|
| 👤 User | User accounts and profile data |
| ✅ Task | Task records with soft delete support |
| 🤝 TaskShare | Shared task relationships between users |
| 🔔 Notification | User notifications triggered by task events |
| 🔐 Session | Refresh token session management |

### 5.2 🔗 Relationships

```text
User
 ├── Task          (one-to-many)
 ├── Session       (one-to-many)
 ├── Notification  (one-to-many)
 └── TaskShare     (one-to-many)

Task
 ├── TaskShare     (one-to-many)
 └── Notification  (one-to-many)
```

### 5.3 👤 User

| Field | Type |
|---|---|
| id | String (UUID) |
| name | String |
| email | String (unique) |
| password | String (hashed) |
| lastLoginAt | DateTime |
| createdAt | DateTime |
| updatedAt | DateTime |

### 5.4 ✅ Task

| Field | Type |
|---|---|
| id | String (UUID) |
| title | String |
| description | String |
| category | String |
| priority | Enum |
| status | Enum |
| dueDate | DateTime |
| ownerId | String (FK → User) |
| deletedAt | DateTime? (soft delete) |

**📌 Business Rules:**
- Created by owner only
- Supports soft delete via `deletedAt`
- Can be shared with other users
- Generates notifications on share/update

### 5.5 🔔 Notification

| Field | Type |
|---|---|
| id | String (UUID) |
| userId | String (FK → User) |
| taskId | String (FK → Task) |
| message | String |
| isRead | Boolean |
| type | Enum |

### 5.6 🔐 Session

| Field | Type |
|---|---|
| id | String (UUID) |
| userId | String (FK → User) |
| refreshToken | String |
| expiresAt | DateTime |
| revokedAt | DateTime? (nullable) |

---

## 6. 🔄 Authentication Flow

TaskFlow uses a dual-token strategy: short-lived JWT access tokens and longer-lived refresh tokens stored in the Session table. Redis blacklists tokens on logout.

1. 📝 Register → hash password → create User record
2. 🔑 Login → validate credentials → generate Access Token + Refresh Token
3. 💾 Store Refresh Token → persist Session record in DB
4. 🛡️ API Requests → verify Access Token via middleware
5. 🔁 Token Refresh → validate Refresh Token → rotate and issue new pair
6. 🚪 Logout → blacklist Access Token in Redis → revoke Session in DB

### 6.1 🔑 Login Request Example

```json
POST /auth/login
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

---

## 7. 🌐 API Catalog

### 7.1 🔐 Authentication APIs

| Method | Endpoint | Auth Required | Purpose |
|---|---|---|---|
| `POST` | /auth/register | No | Register new user |
| `POST` | /auth/login | No | Login and get tokens |
| `POST` | /auth/refresh | Yes | Rotate refresh token |
| `POST` | /auth/logout | Yes | Logout and blacklist token |

### 7.2 ✅ Task APIs

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | /tasks | List all tasks for user |
| `POST` | /tasks | Create a new task |
| `PATCH` | /tasks/:id | Update an existing task |
| `DELETE` | /tasks/:id | Soft-delete a task |

### 7.3 🤝 Share Task APIs

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | /tasks/:id/share | Share a task with another user |
| `GET` | /tasks/shared-with-me | Get tasks shared with me (supports query filters) |
| `GET` | /tasks/shared-with-me/categories | Get categories of tasks shared with me |

### 7.4 🔔 Notification APIs

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | /notifications | Fetch all user notifications |
| `PATCH` | /notifications/:id/read | Mark a specific notification as read |

### 7.5 📊 Dashboard APIs

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | /dashboard/stats | Get aggregated task statistics |

---

## 8. 🟥 Redis

### 8.1 🎯 Purpose

Redis is used exclusively for token blacklisting. When a user logs out, the current access token is stored in Redis with a TTL matching the token's remaining expiry. Any subsequent request bearing that token is rejected immediately without hitting the database.

| Benefit | Detail |
|---|---|
| ⚡ Fast lookups | O(1) key access, sub-millisecond response |
| ⏱️ TTL support | Tokens auto-expire — no manual cleanup needed |
| 🚫 Immediate invalidation | Logout takes effect instantly across all requests |

### 8.2 💻 Installation

**🪟 Windows**

```powershell
net start Memurai
redis-cli ping    # expected: PONG
```

**🐧 Linux**

```bash
sudo apt update && sudo apt install redis-server
redis-server
redis-cli ping    # expected: PONG
```

**🍎 macOS**

```bash
brew install redis
brew services start redis
redis-cli ping    # expected: PONG
```

### 8.3 🔍 Inspecting Blacklisted Tokens

```bash
redis-cli
keys *
ttl blacklist:<token>
get blacklist:<token>
```

### 8.4 ⚠️ Failure Scenarios

| Scenario | Impact | Mitigation |
|---|---|---|
| Redis down at logout | Token blacklisting unavailable | Fall back to DB-backed blacklist |
| Redis down at request | Blacklist check skipped | Circuit breaker + alerting |

---

## 9. 🚀 Setup Guide

### 9.1 ✅ Prerequisites

- 🐘 PostgreSQL installed and running
- 🟥 Redis installed and running
- 🟢 Node.js + pnpm installed

### 9.2 🌍 Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `JWT_SECRET` | Access token signing secret | ✅ Yes |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | ✅ Yes |
| `REDIS_URL` | Redis connection URL | ✅ Yes |
| `PORT` | Backend server port | ✅ Yes |
| `CLIENT_URL` | Frontend origin (CORS) | ✅ Yes |

### 9.3 ⚙️ Backend Setup

```bash
cd server
pnpm install
npx prisma generate
npx prisma migrate dev
pnpm dev
```

### 9.4 🎨 Frontend Setup

```bash
cd client
pnpm install
pnpm dev
```

---

## 10. 🔒 Security

### 10.1 ✅ Implemented

| Feature | Detail |
|---|---|
| 🔒 bcrypt password hashing | All passwords hashed before storage |
| 🔑 JWT authentication | Short-lived access tokens |
| 🔁 Refresh token rotation | New token pair issued on each refresh |
| 🚫 Session revocation | DB-level session can be force-revoked |
| 🛡️ Zod validation | All inputs validated at API boundary |
| 🚧 Protected routes | Middleware guards all authenticated endpoints |
| 🟥 Redis token blacklist | Immediate logout enforcement |

### 10.2 ⚠️ Recommended (Not Yet Implemented)

| Feature | Priority | Effort |
|---|---|---|
| ⏱️ Rate limiting | High | Low |
| 🛡️ CSRF protection | High | Medium |
| 📋 Audit logs | Medium | Medium |
| 📡 Monitoring & alerting | High | Medium |

---

## 11. 💡 Notable Engineering Decisions

### 11.1 🔁 JWT + Refresh Token Rotation

Short-lived access tokens (minutes) limit the window of a stolen token. Refresh token rotation means each use issues a new pair, and the old refresh token is immediately invalidated — detecting replay attacks.

### 11.2 🟥 Redis Token Blacklist

Rather than keeping session state purely in the DB, logout tokens are written to Redis with a TTL. This gives O(1) blacklist checks without touching PostgreSQL on every authenticated request.

### 11.3 🔺 Prisma ORM

Prisma provides type-safe database access with auto-generated TypeScript types, declarative schema migrations, and strong IDE support — reducing runtime query errors significantly.

### 11.4 🎨 Feature-Based Frontend Architecture

Organising code by feature domain (auth, task, shared, dashboard, notification) rather than by technical layer keeps each feature self-contained, making the codebase easier to scale and onboard into.

### 11.5 📦 Module-Based Backend Architecture

Grouping controllers, services, routes, and validators by domain module (auth, task, notification, dashboard) keeps related code co-located, reducing cross-folder jumps and making each module independently maintainable.

### 11.6 🗑️ Soft Delete Pattern

Tasks are never hard-deleted from the database. A `deletedAt` timestamp is set instead, allowing potential restore functionality, audit history, and safer cascades without complex foreign-key cleanup.

---

## 12. 🗺️ Future Roadmap

| Enhancement | Priority | Effort | Impact |
|---|---|---|---|
| ⏱️ Rate Limiting | High | Low | High |
| 🧪 Unit Testing | High | Medium | High |
| 🔗 Integration Testing | High | Medium | High |
| 🔄 CI/CD Pipeline | High | Medium | High |
| 📡 Monitoring | Medium | Low | High |
| 📋 Audit Logs | Medium | Medium | Medium |
| 👥 RBAC | Medium | Medium | High |
| 📨 Redis Pub/Sub | Low | High | Medium |
| 🏛️ Microservices | Low | High | Medium |

---

## 13. 🔬 Technical Deep Dive

### 🔒 Security
- Refresh token rotation with replay detection
- Redis blacklisting for immediate logout enforcement
- bcrypt password hashing
- Session revocation at the DB level

### 🏗️ Architecture
- Feature-based React frontend with Zustand state management
- Module-based backend with co-located controllers, services, routes, and validators
- Soft delete pattern for safe data management
- Type-safe end-to-end with TypeScript + Prisma + Zod

### ⚡ Real-Time
- Socket.IO for live notifications
- Task sharing events pushed to recipients in real time

### 📈 Scalability Considerations
- PostgreSQL with Prisma migrations for schema evolution
- Redis for fast stateless token checks
- Stateless JWT design supports horizontal API scaling
