
import Helper from '../services/helper';

const TransactionValidator = {
  checkAmount(req, res, next) {
    // checks for negative amount
    if (req.body.amount <= 0) {
      const err = 'Please input an appropriate number';
      return Helper.errorResponse(res, 422, err);
    }
    req.check('amount')
      .isFloat()
      .withMessage('Please input a number').trim();

    // checks for the validation errors
    const errors = req.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(res, 422, err);
    }
    return next();
  },
};
export default TransactionValidator;
