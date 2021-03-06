
import Helper from '../services/helper';

const AccountValidator = {
  createAccountValidator(req, res, next) {
    req.check('type')
      .not().isEmpty()
      .withMessage('Type cannot be empty')
      .isIn(['savings', 'current'])
      .withMessage('Please select an appropriate account type');

    // checks for the validation errors
    const errors = req.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },

  changeAccountStatusValidator(req, res, next) {
    req.check('status')
      .isIn(['active', 'dormant'])
      .withMessage('Please select an appropriate status');

    // checks for the validation errors
    const errors = req.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },

  accountNumberValidator(req, res, next) {
    req.checkParams('accountNumber')
      .isNumeric().withMessage('account number must be a number');
    const errors = req.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(res, 422, err);
    }
    // checks for the validation errors
    return next();
  },
};
export default AccountValidator;
