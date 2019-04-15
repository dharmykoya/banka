import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
import Auth from '../middleware/Auth';

const router = Router();

router.post('/:accountNumber/credit', Auth.getUser, Auth.staffCheck, TransactionController.creditAccount);
router.post('/:accountNumber/debit', Auth.getUser, Auth.staffCheck, TransactionController.debitAccount);

export default router;
