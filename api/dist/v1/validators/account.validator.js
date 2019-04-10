"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helper = _interopRequireDefault(require("../services/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AccountValidator = {
  createAccountValidator: function createAccountValidator(req, res, next) {
    req.check('firstName').isLength({
      min: 1
    }).withMessage('Please enter your first name');
    req.check('lastName').isLength({
      min: 1
    }).withMessage('Please enter your last name');
    req.check('email').isEmail().withMessage('Please enter a valid email');
    req.check('type').isIn(['savings', 'current']).withMessage('Please select an appropriate account type'); // checks for the validation errors

    var errors = req.validationErrors(); // if (error) {
    //   res.status(422).send({
    //     status: 422,
    //     error,
    //   });
    // } else {
    //   next();
    // }

    if (errors) {
      var err = errors.map(function (error) {
        return error.msg;
      });
      return _helper.default.errorResponse(res, 422, err);
    }

    return next();
  },
  changeAccountStatusValidator: function changeAccountStatusValidator(req, res, next) {
    req.check('status').isIn(['active', 'dormant']).withMessage('Please select an appropriate status'); // checks for the validation errors

    var errors = req.validationErrors(); // if (error) {
    //   res.status(422).send({
    //     status: 422,
    //     error,
    //   });
    // } else {
    //   next();
    // }

    if (errors) {
      var err = errors.map(function (error) {
        return error.msg;
      });
      return _helper.default.errorResponse(res, 422, err);
    }

    return next();
  }
};
var _default = AccountValidator;
exports.default = _default;