import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

/**
 * 
 */
router.post('/signup', UserController.signUp);

export default router;