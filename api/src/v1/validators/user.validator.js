// import { check, } from 'express-validator/check';
import Helper from '../services/helper';

const UserValidator = {
  signUpValidator(req, res, next) {
    if (req.body.password !== req.body.confirm_password) {
      const error = 'passwords must match';
      return Helper.errorResponse(res, 422, error);
    }
    req.check('firstName').isLength({ min: 1 }).withMessage('Please enter your first name');
    req.check('lastName').isLength({ min: 1 }).withMessage('Please enter your last name');
    req.check('email').isEmail().withMessage('Please enter a valid email');
    req.check('password').isLength({ min: 6 }).withMessage('Pasword can not be less than 6 characters');

    const errors = req.validationErrors();
    // if (error) {
    //   res.status(422).send({
    //     status: 422,
    //     error,
    //   });
    // } else {
    //   next();
    // }
    if (errors) {
      const err = errors.map(error => error.msg);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },

  signInValidator(req, res, next) {
    req.check('email').isEmail().withMessage('Please enter a valid email');
    req.check('password').isLength({ min: 6 }).withMessage('Pasword can not be less than 6 characters');

    const errors = req.validationErrors();
    // if (error) {
    //   res.status(422).send({
    //     status: 422,
    //     error,
    //   });
    // } else {
    //   next();
    // }
    if (errors) {
      const err = errors.map(error => error.msg);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },
};
export default UserValidator;
