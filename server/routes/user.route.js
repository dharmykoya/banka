import { Router } from 'express';
import multer from 'multer';
import UserController from '../controllers/user.controller';
import Auth from '../middleware/Auth';

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/');
  },
  filename(req, file, callback) {
    callback(null, new Date().toISOString().replace(/:/g, '-')
    + file.originalname);
  },
});

const fileFilter = async (req, file, callback) => {
  try {
    if (file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      return await callback(new Error('upload the right format please'), false);
    }
  } catch (err) {
    return err;
  }
  return true;
};
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

// returns all the accounts attached to a user
router.get('/:email/accounts',
  Auth.getUser, Auth.staffCheck,
  UserController.userAccounts);

// route to upload a picture
router.patch('/upload',
  upload.single('profileImage'),
  Auth.getUser,
  UserController.uploadPicture);

export default router;
