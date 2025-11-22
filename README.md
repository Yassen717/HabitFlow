# HabitFlow - Smart Habit Tracker

A professional, full-stack habit tracking application with gamification features. Built with modern web technologies and featuring an enterprise-grade design system.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication
- **Habit Tracking** - Create, manage, and track daily/weekly habits
- **Gamification** - Earn points for completing habits
- **Progress Visualization** - Beautiful charts showing your progress
- **Professional UI/UX** - Portfolio-grade design with glass morphism and smooth animations

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- TailwindCSS 3.4
- Framer Motion (animations)
- Recharts (data visualization)
- React Hot Toast (notifications)
- Axios (HTTP client)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite database
- JWT authentication
- bcryptjs (password hashing)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Smart\ Habit
```

2. **Install dependencies**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

3. **Set up environment variables**

Create `.env` in the backend folder:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
```

4. **Initialize the database**
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

## 🚀 Running the Application

### Development Mode

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
Server runs on http://localhost:3000

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173 (or 5174)

### Production Build

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## 📱 Usage

1. **Register** - Create a new account
2. **Login** - Sign in to your account
3. **Create Habits** - Click "New Habit" to add habits
4. **Track Progress** - Check in daily to earn points
5. **View Stats** - Monitor your progress with visualizations

## 🎨 Design System

- **Colors**: Sky Blue → Indigo → Purple gradient palette
- **Typography**: Space Grotesk (headings) + Inter (body)
- **Effects**: Glass morphism, backdrop blur, premium shadows
- **Animations**: Subtle, 60fps GPU-accelerated transitions

See [PROFESSIONAL_DESIGN_SYSTEM.md](./PROFESSIONAL_DESIGN_SYSTEM.md) for complete design documentation.

## 📂 Project Structure

```
Smart Habit/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── index.css
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- HTTP-only token storage recommended for production
- CORS enabled for development

## 🌟 Key Features

### Authentication
- Split-screen design with branding
- JWT-based secure authentication
- Password hashing with bcrypt

### Dashboard
- 4-column stats grid (Points, Habits, Progress, Total)
- Professional progress chart
- Real-time updates

### Habit Management
- Create/delete habits
- Daily/weekly frequency options
- Progress tracking with visual indicators
- Streak counter

### Gamification
- Point system (10 points per check-in)
- Visual progress bars
- Achievement tracking

## 🚀 Deployment

### Backend Deployment (e.g., Railway, Render)
1. Set environment variables
2. Run `npm run build`
3. Start with `npm start`

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder

## 📝 License

MIT License - feel free to use for your portfolio

## 👨‍💻 Author

Built as a portfolio project showcasing modern full-stack development skills.

## 🙏 Acknowledgments

- Design inspired by modern SaaS applications
- Icons by Lucide React
- Fonts by Google Fonts (Inter, Space Grotesk)
