import { Router } from 'express';
import { getHabits, createHabit, updateHabit, deleteHabit, logHabit } from '../controllers/habit.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { createHabitValidation, logHabitValidation } from '../middleware/validation.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getHabits);
router.post('/', createHabitValidation, createHabit);
router.put('/:id', createHabitValidation, updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/log', logHabitValidation, logHabit);

export default router;
