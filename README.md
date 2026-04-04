# StayLah Backend

A robust backend API for managing specialists and service offerings with comprehensive authentication and media handling.

## 🚀 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5.2.1
- **ORM**: Prisma v6.19.2 with PostgreSQL
- **Authentication**: JWT (jsonwebtoken) + bcryptjs for password hashing
- **File Upload**: Multer + Cloudinary for media storage
- **Task Queue**: BullMQ + Redis for background jobs
- **Real-time**: Socket.io for real-time communication
- **Testing**: Jest v30 + Supertest for API testing
- **Validation**: Zod v4.3.6 for schema validation
- **Development**: tsx for hot-reload development

## 📋 Setup Guide

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** v18+ (recommended: v20 LTS)
- **pnpm** (package manager)
- **PostgreSQL** database server
- **Redis** server (for BullMQ task queues)

### Installation Steps

1. **Clone and navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Or create .env file manually
   ```

4. **Configure environment variables in `.env`:**

   The following variables are **required** (validated by `src/app/config/env.ts`):

   ```env
   # Required Core Variables
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stayLah?schema=public"
   NODE_ENV=development
   FRONTEND_URL="http://localhost:3000"
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

   Additional required variables for full functionality:

   ```env
   # Test Database (required when NODE_ENV=test)
   TEST_DB_URI="postgresql://postgres:postgres@localhost:5432/test_stayLah?schema=public"

   # JWT Secrets (required for authentication - generate strong random strings)
   ACCESS_TOKEN_JWT_SECRET=your-access-token-secret
   ACCESS_TOKEN_JWT_EXPIRATION=10d
   REFRESH_TOKEN_JWT_SECRET=your-refresh-token-secret
   REFRESH_TOKEN_JWT_EXPIRATION=30d
   FORGET_PASSWORD_TOKEN_JWT_SECRET=your-forget-password-secret
   FORGET_PASSWORD_TOKEN_JWT_EXPIRATION=10m

   # Cloudinary (required for media uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Security (required for password hashing)
   BCRYPT_SALT_ROUNDS=10

   # Session (optional - defaults to 'default_secret')
   SESSION_SECRET=your-session-secret
   ```

5. **Set up the database:**

   ```bash
   # Generate Prisma client
   pnpm prisma:generate

   # Run database migrations
   pnpm prisma:migrate

   # (Optional) Open Prisma Studio to view/manage data
   pnpm prisma:studio
   ```

6. **Start the development server:**

   ```bash
   pnpm dev
   ```

   The server will start on `http://localhost:5000` (or your configured PORT).

## 🎯 What to Expect

### Development Features

- **Hot Reload**: Automatic server restart on file changes using `tsx watch`
- **API Documentation**: All endpoints are prefixed with `/api/v1`
- **CORS Enabled**: Configured to accept requests from your frontend URL
- **Request Logging**: Morgan middleware logs all incoming requests
- **Error Handling**: Comprehensive error responses with proper HTTP status codes

### Core Functionality

- **Authentication System**:
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (user/admin roles)
  - Password hashing with bcrypt
  - Cookie-based session management

- **Specialist Management**:
  - Create and manage specialist profiles
  - Draft system for incomplete profiles
  - Verification workflow
  - Media uploads (photos, documents)
  - Service offerings management

- **Media Handling**:
  - File uploads via Multer
  - Cloud storage with Cloudinary
  - Support for images, videos, and documents

- **Background Jobs**:
  - BullMQ task queue for async processing
  - Redis-backed job persistence

- **Real-time Features**:
  - Socket.io integration for real-time communication

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh access token

#### Specialists
- `GET /api/v1/specialists` - Get all specialists
- `GET /api/v1/specialists/:id` - Get specialist by ID
- `POST /api/v1/specialists` - Create specialist
- `PUT /api/v1/specialists/:id` - Update specialist
- `DELETE /api/v1/specialists/:id` - Delete specialist

#### Service Offerings
- `GET /api/v1/service-offerings` - Get all service offerings
- `POST /api/v1/service-offerings` - Create service offering
- `DELETE /api/v1/service-offerings/:id` - Delete service offering

#### Media
- `POST /api/v1/media` - Upload media file
- `DELETE /api/v1/media/:id` - Delete media file

#### Platform Fee
- `GET /api/v1/platform-fee` - Get platform fee configuration
- `PUT /api/v1/platform-fee` - Update platform fee (admin only)

## 🏗️ Architecture

### Modular Structure

Feature-based module organization:

```
src/
├── app/
│   ├── config/       # Configuration (env, database)
│   ├── modules/      # Feature modules
│   │   ├── auth/
│   │   ├── media/
│   │   ├── specialists/
│   │   ├── serviceOffering/
│   │   ├── serviceOfferingsMasterList/
│   │   ├── platformFee/
│   │   └── user/
│   ├── routes/       # Route definitions
│   └── types/        # TypeScript type definitions
├── utils/            # Utility functions
├── server.ts         # Express app setup
└── index.ts          # Entry point
```

### Environment Variables Validation

The application uses `src/app/config/env.ts` to validate required environment variables on startup. The following variables **must** be set or the server will throw an error:

- `PORT` - Server port number
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment mode (development/production/test)
- `FRONTEND_URL` - Frontend application URL for CORS
- `REDIS_HOST` - Redis server hostname
- `REDIS_PORT` - Redis server port

When `NODE_ENV=test`, `TEST_DB_URI` is also required for the test database.

Additional variables used directly by the application (not validated at startup but required for functionality):
- JWT configuration (6 variables)
- Cloudinary credentials (3 variables)
- `BCRYPT_SALT_ROUNDS`
- `SESSION_SECRET` (optional, defaults to 'default_secret')

- **PostgreSQL** with Prisma ORM
- **UUID-based** primary keys for all models
- **Soft deletes** with `deleted_at` timestamps
- **Indexed fields** for optimized queries
- **Enum types** for roles, status, verification status, media types
- **Relations**: Foreign key constraints with cascade deletes

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- auth.test.ts

# Run tests with coverage
pnpm test -- --coverage
```

Tests use a separate test database (configured via `TEST_DB_URI`) to avoid polluting development data.

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build production version (lints + compiles) |
| `pnpm start` | Start production server |
| `pnpm test` | Run Jest tests |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm prisma:studio` | Open Prisma Studio GUI |
| `pnpm prisma:migrate` | Run database migrations |
| `pnpm prisma:generate` | Generate Prisma Client |
| `pnpm prisma:db-push` | Push schema changes to database |
| `pnpm prisma:db-reset` | Reset database (destructive) |

## ⚠️ Important Notes

### Vercel Free Tier Limitation

**Photo Upload Failure (4.5 MB Body Size Limit)**

If photo uploads fail on deployed frontend, it's due to Vercel's free tier limitation:

- **Vercel Free Tier**: Request body size limited to **4.5 MB**
- **Impact**: Large images or multiple images may fail
- **Solutions**:
  1. Compress images before upload (recommended)
  2. Upgrade to Vercel Pro for 100 MB limit
  3. Upload images separately

The backend and Cloudinary support larger files; this is purely a Vercel infrastructure limitation.

### Database Models

- **User**: Authentication and authorization
- **Specialist**: Service provider profiles with ratings and pricing
- **Media**: File attachments for specialists (images, documents)
- **ServiceOffering**: Services offered by specialists
- **ServiceOfferingMasterList**: Master list of available services
- **PlatformFee**: Configurable platform fee structure

## 🔗 Related

- Frontend application runs on port 3000
- Backend server runs on port 5000 (configurable via PORT env var)

---

**StayLah Backend** - Built with ❤️ for managing specialist services
