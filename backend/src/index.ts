import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import authRoutes from './routes/auth.routes';
import habitRoutes from './routes/habit.routes';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.get('/', (req, res) => {
  res.send('Smart Habit Tracker API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
