const AccountValidator = {
  createAccountValidator(req, res, next) {
    req.check('firstName').isLength({ min: 1 }).withMessage('Please enter your first name');
    req.check('lastName').isLength({ min: 1 }).withMessage('Please enter your last name');
    req.check('email').isEmail().withMessage('Please enter a valid email');
    req.check('type').isIn(['savings', 'current']).withMessage('Please select an appropriate account type');

    // checks for the validation errors
    const error = req.validationErrors(true);
    if (error) {
      res.status(422).send({
        status: 422,
        error,
      });
    }
    next();
  },

  changeAccountStatusValidator(req, res, next) {
    req.check('status').isIn(['active', 'dormant']).withMessage('Please select an appropriate status');

    // checks for the validation errors
    const error = req.validationErrors(true);
    if (error) {
      res.status(422).send({
        status: 422,
        error,
      });
    }
    next();
  },
};
export default AccountValidator;
