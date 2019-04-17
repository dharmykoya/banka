import Helper from '../services/helper';

const UserValidator = {
  signUpValidator(req, res, next) {
    const emailExist = Helper.checkEmailExist(req.body.email);
    if (emailExist) {
      const error = 'Email exist already, please login to conitnue';
      return Helper.errorResponse(res, 409, error);
    }
    if (req.body.password !== req.body.confirm_password) {
      const error = 'passwords must match';
      return Helper.errorResponse(res, 422, error);
    }
    req.check('firstName').isAlpha().withMessage('Must be only alphabetical chars').isLength({ min: 2 })
      .withMessage('Please enter your first name');
    req.check('lastName').isAlpha().withMessage('Must be only alphabetical chars').isLength({ min: 2 })
      .withMessage('Please enter your last name');
    req.check('email').isEmail().withMessage('Please enter a valid email');
    req.check('password').isLength({ min: 8 }).withMessage('Pasword can not be less than 6 characters')
      .matches('[0-9]')
      .withMessage('Password must contain a number')
      .matches('[a-z]')
      .withMessage('Password must contain a lower case letter')
      .matches('[A-Z]')
      .withMessage('Password must contain an upper case letter')
      .matches('[~, !, @, #, $, %, ^, &, *, (, ), -, _, +, =, <, >, ?]')
      .withMessage('Password must contain a special char');
    req.check('type').isIn(['client', 'staff', 'admin']).withMessage('Please select an appropriate type');
    const errors = req.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },

  signInValidator(req, res, next) {
    req.check('email').isEmail().withMessage('Please enter a valid email');
    req.check('password').isLength({ min: 6 }).withMessage('Pasword can not be less than 6 characters');

    const errors = req.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },
};
export default UserValidator;
