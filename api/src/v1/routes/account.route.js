import { Router } from 'express';
import AccountController from '../controllers/account.controller';

const router = Router();

router.post('/', AccountController.createAccount);

export default router;