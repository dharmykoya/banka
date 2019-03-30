import { Router } from 'express';
import AccountController from '../controllers/account.controller';

const router = Router();

// this routes creates an account for a user
router.post('/', AccountController.createAccount);

// this route get all the account
router.get('/', AccountController.allAccounts);

// this route changes the status of an account
router.post('/changeStatus', AccountController.changeStatus);

export default router;