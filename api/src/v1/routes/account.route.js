import { Router } from 'express';
import AccountController from '../controllers/account.controller';

const router = Router();

// this routes creates an account for a user
router.post('/', AccountController.createAccount);

// this route get all the account
router.get('/', AccountController.allAccounts);

// this route changes the status of an account
router.put('/:id', AccountController.changeStatus);

// this route delete a bank account
router.delete('/:id', AccountController.deleteAccount);

export default router;