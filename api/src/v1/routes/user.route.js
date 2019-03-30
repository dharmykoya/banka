import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

// this route register a user on the app
router.post('/signup', UserController.signUp);

// this route allows a user login
router.post('/signin', UserController.signIn);

export default router;