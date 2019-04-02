import { Router } from 'express';
import AccountController from '../controllers/account.controller';
import AccountValidator from '../validators/account.validator';

const router = Router();

// this routes creates an account for a user
router.post('/', AccountValidator.createAccountValidator, AccountController.createAccount);

// this route get all the account
router.get('/', AccountController.allAccounts);

// this route changes the status of an account
router.patch('/:accountNumber', AccountController.changeStatus);

// this route delete a bank account
router.delete('/:accountNumber', AccountController.deleteAccount);

export default router;
