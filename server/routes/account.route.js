import { Router } from 'express';
import AccountController from '../controllers/account.controller';
import AccountValidator from '../validators/account.validator';
import Auth from '../middleware/Auth';

const router = Router();


// this routes creates an account for a user
router.post('/',
  Auth.getUser,
  AccountValidator.createAccountValidator,
  AccountController.createAccount);

// this route changes the status of an account
router.patch('/:accountNumber',
  Auth.getUser,
  Auth.staffAdminCheck,
  AccountValidator.changeAccountStatusValidator,
  AccountController.changeStatus);

// this route delete a bank account
router.delete('/:accountNumber',
  Auth.getUser,
  Auth.staffAdminCheck,
  AccountController.deleteAccount);

// GET  /accounts/<account-number>/transactions
// return all the transactions for an account number
router.get('/:accountNumber/transactions',
  Auth.getUser,
  AccountController.allTransactions);

// GET  /accounts/<account-number>
// get a particular account details
router.get('/:accountNumber', Auth.getUser, AccountController.accountDetails);


// GET  /accounts
// View a list of all bank accounts
router.get('/',
  Auth.getUser,
  Auth.staffAdminCheck,
  AccountController.allAccounts);

export default router;
