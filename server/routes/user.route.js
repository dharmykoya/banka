import { Router } from 'express';
import UserController from '../controllers/user.controller';
import Auth from '../middleware/Auth';

const router = Router();

// returns all the accounts attached to a user
router.get('/:email/accounts', Auth.getUser, UserController.userAccounts);

export default router;
