import { Router } from 'express';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';
import Auth from '../middleware/Auth';

const router = Router();

// this route registers a user on the app
router.post('/signup', UserValidator.signUpValidator, UserController.signUp);

// this route allows a user login
router.post('/signin', UserValidator.signInValidator, UserController.signIn);

// this route allows an admin to create a staff
router.post('/addstaff',
  Auth.getUser,
  Auth.AdminCheck,
  UserValidator.signUpValidator,
  UserController.createStaff);

// returns a user detail
router.patch('/password',
  Auth.getUser,
  UserValidator.passwordValidator,
  UserController.updatePassword);

// update a user password
router.get('/:userId',
  UserValidator.userIdValidator,
  Auth.getUser,
  Auth.AdminCheck,
  UserController.userById);
export default router;
