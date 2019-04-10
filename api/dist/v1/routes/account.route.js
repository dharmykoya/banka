"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _account = _interopRequireDefault(require("../controllers/account.controller"));

var _account2 = _interopRequireDefault(require("../validators/account.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)(); // this routes creates an account for a user

router.post('/', _account2.default.createAccountValidator, _account.default.createAccount); // this route changes the status of an account

router.patch('/:accountNumber', _account2.default.changeAccountStatusValidator, _account.default.changeStatus); // this route delete a bank account

router.delete('/:accountNumber', _account.default.deleteAccount);
var _default = router;
exports.default = _default;