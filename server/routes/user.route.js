import { Router } from 'express';
import Upload from '../services/multer';
import UserController from '../controllers/user.controller';
import Auth from '../middleware/Auth';
import UserValidator from '../validators/user.validator';

const router = Router();

// returns all the accounts attached to a user
router.get('/:email/accounts',
  Auth.getUser, Auth.staffAdminCheck,
  UserController.userAccounts);

// returns all the accounts attached to a user
router.get('/:userId',
  UserValidator.userIdValidator,
  Auth.getUser,
  UserController.userAccountsById);

// route to upload a picture
router.patch('/upload',
  Upload.single('profileImage'),
  Auth.getUser,
  UserController.uploadPicture);

export default router;
