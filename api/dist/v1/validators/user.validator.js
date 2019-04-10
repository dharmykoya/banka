"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helper = _interopRequireDefault(require("../services/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { check, } from 'express-validator/check';
var UserValidator = {
  signUpValidator: function signUpValidator(req, res, next) {
    if (req.body.password !== req.body.confirm_password) {
      var error = 'passwords must match';
      return _helper.default.errorResponse(res, 422, error);
    }

    req.check('firstName').isLength({
      min: 1
    }).withMessage('Please enter your first name');
    req.check('lastName').isLength({
      min: 1
    }).withMessage('Please enter your last name');
    req.check('email').isEmail().withMessage('Please enter a valid email');
    req.check('password').isLength({
      min: 6
    }).withMessage('Pasword can not be less than 6 characters');
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
  signInValidator: function signInValidator(req, res, next) {
    req.check('email').isEmail().withMessage('Please enter a valid email');
    req.check('password').isLength({
      min: 6
    }).withMessage('Pasword can not be less than 6 characters');
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
var _default = UserValidator;
exports.default = _default;