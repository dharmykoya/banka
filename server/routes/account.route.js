import { Router } from 'express';
import AccountController from '../controllers/account.controller';
import AccountValidator from '../validators/account.validator';
import Auth from '../middleware/Auth';

const router = Router();

// this routes creates an account for a user
router.post('/', Auth.getUser, AccountValidator.createAccountValidator, AccountController.createAccount);

// this route changes the status of an account
router.patch('/:accountNumber', Auth.getUser, Auth.staffAdminCheck, AccountValidator.changeAccountStatusValidator, AccountController.changeStatus);

// this route delete a bank account
router.delete('/:accountNumber', Auth.getUser, Auth.staffAdminCheck, AccountController.deleteAccount);

export default router;
