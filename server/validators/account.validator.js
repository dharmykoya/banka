
import Helper from '../services/helper';

const AccountValidator = {
  createAccountValidator(req, res, next) {
    req.check('type').isIn(['savings', 'current']).withMessage('Please select an appropriate account type');

    // checks for the validation errors
    const errors = req.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },

  changeAccountStatusValidator(req, res, next) {
    req.check('status').isIn(['active', 'dormant']).withMessage('Please select an appropriate status');

    // checks for the validation errors
    const errors = req.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },
};
export default AccountValidator;
