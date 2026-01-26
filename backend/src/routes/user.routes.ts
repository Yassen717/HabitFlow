import { Router } from 'express';
import { updateProfile, changePassword, updatePreferences, getPreferences } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { updateProfileValidation, changePasswordValidation } from '../middleware/validation.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

router.put('/profile', updateProfileValidation, updateProfile);
router.put('/password', changePasswordValidation, changePassword);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

export default router;
