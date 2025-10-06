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