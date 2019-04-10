"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Account = function Account(id, accountNumber, createdOn, owner, type, status, balance) {
  _classCallCheck(this, Account);

  this.id = id;
  this.accountNumber = accountNumber;
  this.createdOn = createdOn;
  this.owner = owner;
  this.type = type;
  this.status = status;
  this.balance = balance;
};

exports.default = Account;