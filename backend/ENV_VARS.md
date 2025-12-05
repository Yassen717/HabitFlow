# Environment Variables

## Backend Configuration

### Required Variables

- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL database connection string
- `JWT_SECRET` - Secret key for JWT token generation (minimum 32 characters recommended)

### Optional Variables

- `CORS_ORIGIN` - Comma-separated list of allowed origins for CORS (default: "http://localhost:5173,http://localhost:5174")
  - Example: `CORS_ORIGIN=https://myapp.com,https://www.myapp.com`
  
### Example .env file

**Development (Local PostgreSQL):**
```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/habitflow_dev"
JWT_SECRET="your-super-secret-key-at-least-32-characters-long"
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"
```

**Production (e.g., Railway, Render):**
```env
PORT=3000
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
JWT_SECRET="your-super-secret-key-at-least-32-characters-long"
CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"
NODE_ENV="production"
```

### Production Configuration

For production deployment, ensure you:
1. Set a strong JWT_SECRET (min 32 chars)
2. Configure CORS_ORIGIN with your production domain(s)
3. Use a production-grade database (PostgreSQL recommended)
