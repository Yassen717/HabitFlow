import { Router } from 'express';
import { getHabits, createHabit, deleteHabit, logHabit } from '../controllers/habit.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getHabits);
router.post('/', createHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/log', logHabit);

export default router;
