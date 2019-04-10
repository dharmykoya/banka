"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _transaction = _interopRequireDefault(require("../data/transaction"));

var _transaction2 = _interopRequireDefault(require("../models/transaction.model"));

var _account = _interopRequireDefault(require("./account.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class UserService
 * @description handles the request coming from the service controller.
 * @exports TransactionService
 */
var TransactionService =
/*#__PURE__*/
function () {
  function TransactionService() {
    _classCallCheck(this, TransactionService);
  }

  _createClass(TransactionService, null, [{
    key: "creditAccount",

    /**
     * @description credit a bank account
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof TransactionService
     */
    value: function creditAccount(userAccountNumber, tranAmount) {
      var parseAmount = parseFloat(tranAmount);
      var parseAccountNumber = parseInt(userAccountNumber, Number);

      var foundAccount = _account.default.findAccountByAccountNumber(parseAccountNumber); // checks if the account does not exist


      if (foundAccount.error) {
        return foundAccount;
      } // checks if the account is dormant


      if (foundAccount.status === 'dormant') {
        var response = {
          error: true,
          message: 'Account is dormant. Please reactivate.'
        };
        return response;
      }

      var transactionLength = _transaction.default.transactions.length;
      var lastTransactionId = _transaction.default.transactions[transactionLength - 1].id;
      var id = lastTransactionId + 1;
      var type = 'credit';
      var tranCashier = 1;
      var oldBalance = parseFloat(foundAccount.balance);
      var transaction = this.transactionAction(type, id, tranCashier, parseAccountNumber, parseAmount, oldBalance); // updating the found record

      foundAccount.balance = transaction.accountBalance;
      return transaction;
    }
    /**
     * @description debit a bank account
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof TransactionService
     */

  }, {
    key: "debitAccount",
    value: function debitAccount(accountNumber, amount) {
      var parseAmount = parseFloat(amount);
      var parseAccountNumber = parseInt(accountNumber, Number);

      var foundAccount = _account.default.findAccountByAccountNumber(parseAccountNumber); // checks if the account does not exist


      if (foundAccount.error) {
        return foundAccount;
      } // checks if the account is dormant


      if (foundAccount.status === 'dormant') {
        var response = {
          error: true,
          message: 'Account is dormant. Please reactivate.'
        };
        return response;
      } // checks if the amount to withdraw is greater than the account balance


      if (foundAccount.balance < parseAmount) {
        var _response = {
          error: true,
          message: 'Insufficient Balance.'
        };
        return _response;
      }

      var transactionLength = _transaction.default.transactions.length;
      var lastTransactionId = _transaction.default.transactions[transactionLength - 1].id;
      var id = lastTransactionId + 1;
      var type = 'debit';
      var cashier = 1;
      var oldBalance = parseFloat(foundAccount.balance);
      var transaction = this.transactionAction(type, id, cashier, parseAccountNumber, parseAmount, oldBalance); // updating the found record

      foundAccount.balance = transaction.accountBalance;
      return transaction;
    }
    /**
     * @description makes the transaction depending on the type
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof TransactionService
     */

  }, {
    key: "transactionAction",
    value: function transactionAction(type, id, cashier, parseAccountNumber, parseAmount, oldBalance) {
      var newBalance;
      var minBalance = parseFloat(1000);
      var createdOn = (0, _moment.default)().format('DD-MM-YYYY');

      if (type === 'credit') {
        newBalance = oldBalance + parseAmount;
      } else if (type === 'debit') {
        newBalance = oldBalance - parseAmount; // checks if the amount to withdraw is greater than the account balance

        if (newBalance < minBalance) {
          var _response2 = {
            error: true,
            message: "You can not have less than ".concat(minBalance, " in your account.")
          };
          return _response2;
        }
      } // creating a new instance of the Transaction


      var transaction = new _transaction2.default(id, createdOn, type, parseAccountNumber, cashier, parseAmount, oldBalance, newBalance);
      _transaction.default.transactions = [].concat(_toConsumableArray(_transaction.default.transactions), [transaction]);
      var response = {
        transactionId: id,
        accountNumber: parseAccountNumber,
        amount: parseAmount,
        cashier: cashier,
        transactionType: type,
        accountBalance: newBalance.toString()
      };
      return response;
    }
  }]);

  return TransactionService;
}();

var _default = TransactionService;
exports.default = _default;