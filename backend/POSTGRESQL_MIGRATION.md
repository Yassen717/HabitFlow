# PostgreSQL Migration Guide

## Overview

The application has been updated to use PostgreSQL instead of SQLite for production readiness. PostgreSQL is required for deployment to platforms like Railway, Render, Heroku, etc.

---

## Local Development Setup

### Option 1: Using Docker (Recommended)

```bash
# Run PostgreSQL in Docker
docker run --name habitflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=habitflow_dev \
  -p 5432:5432 \
  -d postgres:16-alpine

# Verify it's running
docker ps
```

### Option 2: Install PostgreSQL Locally

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Install and remember your password
3. PostgreSQL runs on port 5432 by default

**macOS (with Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb habitflow_dev
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb habitflow_dev
```

---

## Migration Steps

### 1. Update Environment Variables

Update your `backend/.env` file:

```env
# Replace SQLite connection with PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/habitflow_dev"
```

**Connection String Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

### 2. Install PostgreSQL Driver (if needed)

The `@prisma/client` already includes the necessary drivers, but ensure you have the latest:

```bash
cd backend
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Create Database Schema

**Option A: Use existing migrations (Recommended)**
```bash
# This will apply all existing migrations to PostgreSQL
npx prisma migrate deploy
```

**Option B: Create fresh migration**
```bash
# This creates a new migration based on your schema
npx prisma migrate dev --name init_postgresql
```

### 5. Seed Achievements (Important!)

After migration, seed the achievements:

```bash
# Create a seed script
node -e "
const { PrismaClient } = require('@prisma/client');
const { seedAchievements } = require('./src/lib/achievement.service');
const prisma = new PrismaClient();

seedAchievements()
  .then(() => {
    console.log('✅ Achievements seeded successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding achievements:', error);
    process.exit(1);
  });
"
```

Or run manually in your application during first startup.

### 6. Test the Migration

```bash
# Start the backend server
npm run dev

# Check logs for successful database connection
# You should see: "Server is running on port 3000"
```

---

## Verification Checklist

- [ ] PostgreSQL is running (check with `docker ps` or `pg_isready`)
- [ ] DATABASE_URL is correctly set in `.env`
- [ ] Prisma client generated: `npx prisma generate`
- [ ] Migrations applied: `npx prisma migrate deploy`
- [ ] Achievements seeded
- [ ] Server starts without database errors
- [ ] Can register a new user
- [ ] Can create and log habits

---

## Production Deployment

### Railway (Recommended)

1. **Create PostgreSQL Database:**
   - Railway automatically provisions PostgreSQL
   - Connection string available in environment variables

2. **Set Environment Variables:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-injected by Railway
   JWT_SECRET=<your-secret-key>
   CORS_ORIGIN=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

3. **Deploy:**
   - Railway runs migrations automatically via `package.json` build script
   - Or add: `"build": "npx prisma generate && npx prisma migrate deploy && tsc"`

### Render

1. **Create PostgreSQL Database:**
   - Add PostgreSQL service in Render dashboard
   - Copy Internal Database URL

2. **Set Environment Variables:**
   ```
   DATABASE_URL=<internal-database-url>
   JWT_SECRET=<your-secret-key>
   CORS_ORIGIN=https://your-frontend.onrender.com
   NODE_ENV=production
   ```

3. **Build Command:**
   ```
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```

### Other Platforms (Heroku, Fly.io, etc.)

Similar steps:
1. Provision PostgreSQL addon
2. Set DATABASE_URL from addon
3. Run migrations in build step
4. Seed achievements on first deploy

---

## Troubleshooting

### "Can't reach database server"
- Check PostgreSQL is running: `docker ps` or `pg_isready`
- Verify DATABASE_URL format
- Check firewall settings

### "Database does not exist"
```bash
# Create database manually
docker exec -it habitflow-postgres createdb -U postgres habitflow_dev
# Or use psql
psql -U postgres -c "CREATE DATABASE habitflow_dev;"
```

### "Migration failed"
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or start fresh
npx prisma migrate dev --name init
```

### "SSL connection required" (Production)
Update DATABASE_URL to include SSL:
```
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

---

## Comparison: SQLite vs PostgreSQL

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Deployment** | ❌ File-based, not scalable | ✅ Production-ready |
| **Concurrency** | ❌ Single writer | ✅ Multiple connections |
| **Data Types** | Limited | Full SQL support |
| **Scalability** | Small apps only | Enterprise-grade |
| **Cost** | Free | Free (self-host) or ~$5-10/mo |

---

## Rollback to SQLite (Not Recommended)

If you need to rollback temporarily:

1. Change `schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Update `.env`:
   ```env
   # DATABASE_URL not needed for SQLite
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

**Note:** SQLite is NOT suitable for production deployment.
