"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _user = _interopRequireDefault(require("../controllers/user.controller"));

var _user2 = _interopRequireDefault(require("../validators/user.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)(); // this route register a user on the app

router.post('/signup', _user2.default.signUpValidator, _user.default.signUp); // this route allows a user login

router.post('/signin', _user2.default.signInValidator, _user.default.signIn);
var _default = router;
exports.default = _default;