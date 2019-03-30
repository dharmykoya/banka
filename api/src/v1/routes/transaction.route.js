import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';

const router = Router();

router.post('/credit', TransactionController.creditAccount);
router.post('/debit', TransactionController.debitAccount);

export default router;