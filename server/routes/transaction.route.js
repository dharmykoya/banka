import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
import TransactionValidator from '../validators/transaction.validator';
import Auth from '../middleware/Auth';

const router = Router();

router.post('/:accountNumber/credit',
  TransactionValidator.checkAmount,
  Auth.getUser, Auth.staffCheck,
  TransactionController.creditAccount);

router.post('/:accountNumber/debit',
  TransactionValidator.checkAmount,
  Auth.getUser, Auth.staffCheck, TransactionController.debitAccount);

// to view a specific transaction GET  /transactions/<transaction-id>
router.get('/:transactionId',
  Auth.getUser,
  TransactionController.getTransaction);

export default router;
