"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transaction = function Transaction(id, createdOn, type, accountNumber, cashier, amount, oldBalance, newBalance) {
  _classCallCheck(this, Transaction);

  this.id = id;
  this.createdOn = createdOn;
  this.type = type;
  this.accountNumber = accountNumber;
  this.cashier = cashier;
  this.amount = amount;
  this.oldBalance = oldBalance;
  this.newBalance = newBalance;
};

exports.default = Transaction;