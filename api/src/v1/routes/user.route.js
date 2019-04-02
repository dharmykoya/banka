import { Router } from 'express';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';

const router = Router();

// this route register a user on the app
router.post('/signup', UserValidator, UserController.signUp);

// this route allows a user login
router.post('/signin', UserController.signIn);

export default router;
