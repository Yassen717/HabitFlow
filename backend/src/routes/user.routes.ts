import { Router } from 'express';
import { updateProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { updateProfileValidation } from '../middleware/validation.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

router.put('/profile', updateProfileValidation, updateProfile);

export default router;
