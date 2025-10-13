# GMS Backend — Changes & Setup

This README documents the changes made to the repository during the recent work: features added, files created or modified, commands to reproduce / run the project locally, migration instructions, and example API calls.

Date: October 13, 2025

---

## Summary of work performed

- Ensured CORS is enabled globally in `backend/src/index.ts` (already present as `app.use(cors())`).
- Refactored member routing so `MemberController` exports an Express `Router` mounted at `/api/members`.
- Added a complete User flow (model, repository, service, controller/router, migration): create, read, update, delete users.
- Changed the user creation API to accept `password` (plain text) in the request; service hashes it and stores `password_hash` in DB.
- Added authentication (login) that accepts `identifier` (username or email) + `password` and returns a JWT.
- Added dependencies: `bcryptjs`, `jsonwebtoken` and their type packages.
- Created migration for `users` table and followed project migration conventions.
- Ran TypeScript compile checks (`npx tsc --noEmit`) and installed dependencies.

All changes are in the `backend/` folder. Below is a detailed file-by-file list and how to reproduce everything.

---

## Files added

- `backend/src/models/User.ts` — TypeScript class model for User.
- `backend/src/repositories/UserRepository.ts` — Postgres Pool-based repository to create/read/update/delete users.
- `backend/src/services/UserService.ts` — Business logic for users (validation, uniqueness, password hashing). NOTE: expects `password` in create/update requests.
- `backend/src/controllers/UserController.ts` — Controller and exported `UserRouter` (CRUD endpoints) mounted at `/api/users`.
- `backend/src/migrations/1696700000000-CreateUsersTable.ts` — Migration to create the `users` table (UUID PK, unique email/username, `password_hash`, timestamps, update trigger).
- `backend/src/services/AuthService.ts` — Auth service that validates credentials and issues JWT tokens.
- `backend/src/controllers/AuthController.ts` — Controller and exported `AuthRouter` mounted at `/api/auth` with `POST /login`.
- `backend/README.md` — (this file) summary of steps and run instructions.

Files modified (high level)

- `backend/src/index.ts` — Mounted `MemberRouter`, `UserRouter`, and `AuthRouter`; ensured `app.use(cors())` and swagger setup are present.
- `backend/src/controllers/MemberController.ts` — Exported `MemberRouter` (wires controller to routes) and kept controller implementation.
- `backend/package.json` — Added dependencies: `bcryptjs`, `jsonwebtoken` and dev types (`@types/bcryptjs`, `@types/jsonwebtoken`).

---

## Environment variables

Create a `.env` file in `backend/` or set environment variables in your environment with at least the following values:

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `5432`)
- `DB_USER` (default: `postgres`)
- `DB_PASSWORD` (default: `postgres`)
- `DB_NAME` (default: `gms_db`)
- `PORT` (default: `3000`)
- `JWT_SECRET` (set a secure secret for production; default placeholder used in dev)
- `ALLOWED_ORIGINS` (optional) — if you later use an allowlist for CORS

Example `.env` (backend/.env):

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gms_db
PORT=3000
JWT_SECRET=supersecret_dev_change_in_prod
```

---

## Install dependencies

From repo root:

```powershell
cd backend
npm install
```

This will install the following new packages added during the work:

- `bcryptjs` (password hashing)
- `jsonwebtoken` (JWT creation)

Type definitions were also added to devDependencies for TypeScript.

---

## Migrations

Two migration files exist now under `backend/src/migrations/`:

- `1696600000000-CreateMembersTable.ts` — existing members migration
- `1696700000000-CreateUsersTable.ts` — new users migration (created by me)

Run migrations in whichever way your project uses them. You can run the specific migration directly with `ts-node`:

```powershell
cd backend
npx ts-node src/migrations/1696700000000-CreateUsersTable.ts up
```

Or run your project's migrate script if it is configured to pick up migration files:

```powershell
cd backend
npm run migrate
```

If you need to roll the migration back:

```powershell
cd backend
npx ts-node src/migrations/1696700000000-CreateUsersTable.ts down
```

Note: migrations use `uuid-ossp` extension and create an `update_updated_at_column()` trigger for automatic `updated_at` timestamps.

---

## Build / Type-check

Type-check the backend TypeScript without emitting JS:

```powershell
cd backend
npx tsc --noEmit
```

This was executed during the work and reported no type errors after installing the added dependencies.

---

## Run server (development)

```powershell
cd backend
npm run dev
```

This uses `ts-node` to run `src/index.ts` directly. Visit Swagger at `http://localhost:3000/api-docs` when the server is running.

---

## API Endpoints (summary)

Members (existing)
- GET /api/members — list members
- POST /api/members — create member
- GET /api/members/:id — get member
- PUT /api/members/:id — update member
- DELETE /api/members/:id — delete member

Users (added)
- POST /api/users — create user
  - Request body (JSON):
    - `firstName` (string)
    - `lastName` (string)
    - `email` (string, email)
    - `username` (string)
    - `password` (string)  <-- plain password; server will hash and store
- GET /api/users — list users
- GET /api/users/:id — get user by id
- PUT /api/users/:id — update user (pass `password` to change password)
- DELETE /api/users/:id — delete user

Authentication
- POST /api/auth/login — login with `identifier` and `password`
  - Body: `{ "identifier": "alice" | "alice@example.com", "password": "..." }`
  - Returns: `{ user: { id, firstName, lastName, email, username, createdAt, updatedAt }, token: "<jwt>" }`

Example create user (curl):

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alice","lastName":"Smith","email":"alice@example.com","username":"alice","password":"My$ecret123"}'
```

Example login (PowerShell Invoke-RestMethod):

```powershell
$body = @{ identifier = 'alice'; password = 'My$ecret123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -Body $body -ContentType 'application/json'
```

When you receive the JWT token you can add an `Authorization: Bearer <token>` header to protect endpoints once you add the middleware.

---

## Notes, caveats and next steps

- Passwords are hashed with `bcryptjs` before storage; the DB column is `password_hash`.
- JWT secret is read from `JWT_SECRET`. Change it in production and keep it secret.
- I added a minimal Swagger doc for the `POST /api/users` endpoint; you can extend schemas in `src/index.ts`'s `swaggerOptions` to include the new `User` schema.
- Consider adding input validation middleware (eg. `express-validator`) to validate email format, password strength, and required fields before hitting services.
- If you'd like, I can add a JWT auth middleware and protect user/member routes, add refresh tokens, and add automated tests that exercise the new flow.

---

## Exact command history I ran while working (reproducible steps)

These are the commands I executed while developing and verifying the changes. Run them from your local environment (project root):

```powershell
# 1) Install dependencies for backend
cd backend; npm install

# 2) Type-check
npx tsc --noEmit

# 3) Run specific migration (create users table)
npx ts-node src/migrations/1696700000000-CreateUsersTable.ts up

# 4) Start dev server
npm run dev

# 5) Example requests (PowerShell)
$create = @{ firstName='Alice'; lastName='Smith'; email='alice@example.com'; username='alice'; password='My$ecret123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/users -Body $create -ContentType 'application/json'

$login = @{ identifier='alice'; password='My$ecret123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -Body $login -ContentType 'application/json'
```

---

If you want, I can now:

- Add JWT middleware and protect routes.
- Extend Swagger/OpenAPI schemas for `User` and `Auth` responses and add these files to `swaggerOptions.apis`.
- Add integration tests that create a user, authenticate, then call a protected endpoint.

If you want any of these, tell me which and I'll implement and run the quick smoke tests.

---

Thanks — the repository now contains the full user CRUD + auth flow, migrations, and documentation steps above.
# Gym Management System (GMS)

A full-stack application for managing gym memberships and operations using a database-first approach with direct PostgreSQL integration.

## Backend Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (v6 or higher)
- Visual Studio Code (recommended)

### Database Setup

1. Ensure PostgreSQL is running on your system.

2. Connect to PostgreSQL as a superuser:
```bash
psql -U postgres
```

3. Create a new database and enable required extensions:
```sql
CREATE DATABASE gms_db;
\c gms_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

4. Create a `.env` file in the backend directory:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=gms_db
```

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database schema:
```bash
npx ts-node src/migrations/1696600000000-CreateMembersTable.ts up
```

### Running the Application

Development mode:bom buil
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will start at http://localhost:3000

### API Documentation

Swagger documentation is available at http://localhost:3000/api-docs

### Testing

Run the test suite:
```bash
npm test
```

## Development

### Project Structure
```
backend/
├── src/
│   ├── controllers/    # HTTP request handlers
│   ├── services/      # Business logic
│   ├── repositories/  # Database queries
│   ├── models/       # Data models
│   ├── config/       # Configuration
│   ├── migrations/   # SQL migrations
│   ├── tests/        # Unit tests
│   └── docs/         # Documentation
├── package.json
└── tsconfig.json
```

### Database Schema

The members table includes:
- `id` (UUID, primary key)
- `first_name` (VARCHAR(100))
- `last_name` (VARCHAR(100))
- `email` (VARCHAR(255), unique)
- `phone` (VARCHAR(20))
- `membership_type` (VARCHAR(50))
- `start_date` (TIMESTAMP)
- `end_date` (TIMESTAMP)
- `status` (VARCHAR(20))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Testing

Run the test suite:
```bash
npm test
```

Tests are written using Jasmine and include:
- Unit tests for services
- Integration tests for repositories
- API endpoint tests

## API Documentation

### Members API

All endpoints support JSON format for request/response.

#### Create Member
- **POST** `/api/members`
- Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "membershipType": "STANDARD",
  "startDate": "2025-10-06T00:00:00.000Z",
  "endDate": "2025-11-06T00:00:00.000Z",
  "status": "ACTIVE"
}
```

#### Get All Members
- **GET** `/api/members`

#### Get Member by ID
- **GET** `/api/members/:id`

#### Update Member
- **PUT** `/api/members/:id`
- Body: Same as create member (all fields optional)

#### Delete Member
- **DELETE** `/api/members/:id`

### Data Types

#### Membership Types
- `STANDARD`
- `PREMIUM`
- `VIP`

#### Member Status
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

### Troubleshooting

1. Database Connection Issues:
   - Verify PostgreSQL service is running
   - Check credentials in `.env`
   - Ensure database and UUID extension exist
   - Test connection: `psql -U postgres -d gms_db`

2. Build Issues:
   - Clear build cache: `rm -rf dist`
   - Rebuild: `npm run build`

3. Runtime Issues:
   - Check logs for SQL errors
   - Verify environment variables
   - Ensure database schema is up to date

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request