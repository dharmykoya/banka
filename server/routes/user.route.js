import { Router } from 'express';
import Upload from '../services/multer';
import UserController from '../controllers/user.controller';
import Auth from '../middleware/Auth';
import UserValidator from '../validators/user.validator';
import cloudUpload from '../services/uploadPicture';


const router = Router();

// returns all the accounts attached to a user
router.get('/:email/accounts',
  Auth.getUser, Auth.staffAdminCheck,
  UserController.userAccounts);

// route to get all Staff;
router.get('/staff',
  Auth.getUser,
  Auth.AdminCheck,
  UserController.allStaff);

// returns all the accounts attached to a user
router.get('/:userId',
  UserValidator.userIdValidator,
  Auth.getUser,
  UserController.userAccountsById);

// route to upload a picture
router.patch('/upload',
  Auth.getUser,
  Upload.single('profileImage'),
  cloudUpload.uploadToCloud,
  UserController.uploadPicture);


export default router;
