"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User(id, email, firstName, lastName, password, type, isAdmin) {
  _classCallCheck(this, User);

  this.id = id;
  this.email = email;
  this.firstName = firstName;
  this.lastName = lastName;
  this.password = password;
  this.type = type;
  this.isAdmin = isAdmin;
};

exports.default = User;