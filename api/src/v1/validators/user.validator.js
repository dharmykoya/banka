// import { check, } from 'express-validator/check';

const UserValidator = (req, res, next) => {
  req.check('firstName').isLength({ min: 1 }).withMessage('Please enter your first name');
  req.check('lastName').isLength({ min: 1 }).withMessage('Please enter your last name');
  req.check('email').isEmail().withMessage('Please a valid email');
  req.check('password').isLength({ min: 6 }).withMessage('Pasword can not be less than 6 characters');

  const error = req.validationErrors(true);
  if (error) {
    res.status(422).send({
      status: 422,
      error,
    });
  }
  next();
};
export default UserValidator;
