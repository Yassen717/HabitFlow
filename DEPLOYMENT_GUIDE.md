# 🚀 Free Deployment Guide - Vercel + Render + Neon.tech

Complete guide to deploy HabitFlow for **100% free** using:
- **Frontend:** Vercel
- **Backend:** Render.com
- **Database:** Neon.tech (PostgreSQL)

**Total Cost: $0/month** ✅

---

## 📋 Prerequisites

- [x] GitHub account
- [x] Code pushed to GitHub repository
- [ ] Vercel account (sign up with GitHub)
- [ ] Render.com account (sign up with GitHub)
- [ ] Neon.tech account (sign up with GitHub)

---

## Step 1: Set Up Database (Neon.tech) - 3 minutes

### 1.1 Create Neon Account & Project

1. **Go to:** https://neon.tech
2. **Click:** "Sign Up" → Sign in with GitHub
3. **Create Project:**
   - Project name: `habitflow` (or your preferred name)
   - Region: Choose closest to you (e.g., US East, EU West)
   - PostgreSQL version: 16 (default)
   - Click "Create Project"

### 1.2 Get Connection String

After project creation, you'll see the connection details:

1. **Find:** "Connection string" section
2. **Copy:** The connection string (looks like this):
   ```
   postgresql://username:password@ep-xyz-123.us-east-2.aws.neon.tech/habitflow?sslmode=require
   ```
3. **Important:** Save this - you'll need it for Render deployment

### 1.3 Configure Database

Neon creates a default database. No additional configuration needed! The database will:
- ✅ Auto-suspend when idle (free tier)
- ✅ Wake up in milliseconds when accessed
- ✅ Handle up to 3GB of data

---

## Step 2: Deploy Backend (Render.com) - 5 minutes

### 2.1 Create Render Account

1. **Go to:** https://render.com
2. **Click:** "Get Started for Free"
3. **Sign in** with GitHub

### 2.2 Create Web Service

1. **Click:** "New +" → "Web Service"
2. **Connect GitHub:**
   - Click "Connect GitHub"
   - Select your repository: `Smart Habit` (or your repo name)
   - Click "Connect"

### 2.3 Configure Service

**Basic Settings:**
- **Name:** `habitflow-backend` (or your choice)
- **Region:** Same as Neon database (or closest to you)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** 
  ```bash
  npm install && npx prisma generate && npx prisma migrate deploy && npm run build
  ```
- **Start Command:** 
  ```bash
  npm start
  ```

**Instance Type:**
- Select: **Free** ($0/month)

### 2.4 Add Environment Variables

Scroll down to "Environment Variables" and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `<paste-your-neon-connection-string>` |
| `JWT_SECRET` | `your-super-secret-key-min-32-chars-random-string-here` |
| `CORS_ORIGIN` | `https://your-app.vercel.app` (update after Vercel deployment) |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

**Generate JWT_SECRET:** Use a random string generator or run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Deploy

1. **Click:** "Create Web Service"
2. **Wait:** 2-5 minutes for initial deployment
3. **Watch:** Build logs to ensure success
4. **Copy:** Your backend URL (e.g., `https://habitflow-backend.onrender.com`)

### 2.6 Verify Deployment

Once deployed, test your backend:
```bash
curl https://your-backend.onrender.com
# Should return: "Smart Habit Tracker API is running!"
```

---

## Step 3: Deploy Frontend (Vercel) - 2 minutes

### 3.1 Create Vercel Account

1. **Go to:** https://vercel.com
2. **Click:** "Sign Up"
3. **Sign in** with GitHub

### 3.2 Import Project

1. **Click:** "Add New..." → "Project"
2. **Import Git Repository:**
   - Find your repository
   - Click "Import"

### 3.3 Configure Project

**Framework Preset:** Vite (auto-detected)

**Root Directory:** `frontend`

**Build Settings:**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `dist` (auto-detected)

### 3.4 Add Environment Variable

**Click** "Environment Variables" and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com` (from Step 2.5) |

### 3.5 Deploy

1. **Click:** "Deploy"
2. **Wait:** 1-2 minutes
3. **Copy:** Your frontend URL (e.g., `https://habitflow-xyz.vercel.app`)

### 3.6 Update Backend CORS

**Go back to Render:**
1. Dashboard → Your Backend Service
2. Environment → Edit `CORS_ORIGIN`
3. Update to: `https://your-app.vercel.app` (from Step 3.5)
4. Save → Service will auto-redeploy

---

## Step 4: Seed Achievements - 2 minutes

Your database is empty! Seed the achievements:

### Option 1: Using Render Shell

1. **Go to:** Render Dashboard → Your Service
2. **Click:** "Shell" tab (top right)
3. **Run:**
   ```bash
   node -e "
   const { seedAchievements } = require('./dist/lib/achievement.service');
   seedAchievements().then(() => {
     console.log('✅ Achievements seeded');
     process.exit(0);
   }).catch(err => {
     console.error('Error:', err);
     process.exit(1);
   });
   "
   ```

### Option 2: Create Script (Better)

Add to `backend/package.json`:
```json
{
  "scripts": {
    "seed": "node -e \"require('./dist/lib/achievement.service').seedAchievements().then(() => process.exit(0))\""
  }
}
```

Then run in Render Shell:
```bash
npm run seed
```

---

## Step 5: Test Everything! 🎉

### 5.1 Visit Your App

Go to: `https://your-app.vercel.app`

### 5.2 Test User Flow

1. **Register** a new account
2. **Login** with credentials
3. **Create** a habit
4. **Log** a habit completion
5. **Check** points are awarded
6. **View** profile

### 5.3 Verify Database

**Check Neon Dashboard:**
1. Go to your Neon project
2. Click "Tables"
3. Should see: User, Habit, Log, Achievement, etc.

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

**Vercel (Frontend):**
1. Domains → Add Domain
2. Follow DNS configuration steps

**Render (Backend):**
1. Settings → Custom Domain
2. Add your API subdomain (e.g., `api.yourdomain.com`)

### Monitoring

**Render:**
- Free tier includes basic logs
- Set up: Dashboard → Your Service → Logs

**Vercel:**
- Analytics available in dashboard
- Free for hobby projects

### Keep Backend Warm (Prevent Cold Starts)

**Option 1: UptimeRobot (Free)**
1. Sign up at https://uptimerobot.com
2. Create monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend.onrender.com`
   - Interval: 5 minutes
3. Keeps backend from sleeping!

**Option 2: Cron Job (Code)**
Later, you can add a simple cron job to ping itself.

---

## 📊 Usage Limits (Free Tier)

### Neon.tech
- ✅ 3GB storage
- ✅ Unlimited queries
- ✅ 1 project
- ✅ Auto-suspend when idle

### Render.com
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Spins down after 15min inactivity
- ⚠️ ~30s cold start time
- ✅ Unlimited deployments

### Vercel
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Global CDN
- ✅ Analytics included

---

## 🐛 Troubleshooting

### Backend won't start
**Check Render logs:**
- Ensure all environment variables are set
- Verify DATABASE_URL is correct
- Check migrations ran successfully

### CORS errors
**Update CORS_ORIGIN:**
- Must exactly match your Vercel URL
- Include `https://`
- No trailing slash

### Database connection failed
**Check Neon connection:**
- Verify connection string copied correctly
- Ensure `?sslmode=require` is in URL
- Check Neon project is active (not suspended)

### Frontend can't reach backend
**Check VITE_API_BASE_URL:**
- Environment variable set in Vercel
- Starts with `https://`
- Points to correct Render URL

### Rate limiting issues
**If hitting rate limits in development:**
- Wait 15 minutes
- Or temporarily increase limits in code

---

## 🔄 Deployment Workflow

### Making Updates

**Automatic deployments are set up!**

**Frontend:**
```bash
git add .
git commit -m "feat: update frontend"
git push origin main
# Vercel auto-deploys in ~1 minute
```

**Backend:**
```bash
git add .
git commit -m "feat: update backend"
git push origin main
# Render auto-deploys in ~2-3 minutes
```

### Database Migrations

When you add new migrations:
```bash
# Local: Create migration
npx prisma migrate dev --name add_new_feature

# Commit migration files
git add prisma/migrations
git commit -m "feat: add database migration"
git push

# Render will auto-run: npx prisma migrate deploy
```

---

## 📈 Upgrading (Optional)

When your app grows, consider:

| Service | Free Tier | Paid Tier | Cost |
|---------|-----------|-----------|------|
| **Neon** | 3GB storage | Unlimited | $19/mo |
| **Render** | Sleeps after 15min | Always on | $7/mo |
| **Vercel** | 100GB bandwidth | 1TB bandwidth | $20/mo |

For most hobby projects, **free tier is enough!**

---

## ✅ Deployment Checklist

- [ ] Neon database created & connection string saved
- [ ] Render backend deployed with all env variables
- [ ] Vercel frontend deployed with API URL
- [ ] CORS_ORIGIN updated on backend
- [ ] Achievements seeded
- [ ] Test: Register account works
- [ ] Test: Create & log habit works
- [ ] Test: Points system works
- [ ] Optional: UptimeRobot monitor set up
- [ ] Optional: Custom domain configured

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide for **$0/month**!

**Share your app:**
- Frontend: `https://your-app.vercel.app`
- API: `https://your-backend.onrender.com`

**Next Steps:**
- Add to your portfolio
- Share with friends/recruiters
- Monitor usage in dashboards
- Consider adding analytics

---

## 📚 Resources

- [Neon Documentation](https://neon.tech/docs)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma with Neon Guide](https://neon.tech/docs/guides/prisma)

Need help? Check the troubleshooting section or reach out to each platform's support (all have great communities!).
