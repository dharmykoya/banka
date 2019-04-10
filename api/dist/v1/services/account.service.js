"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _account = _interopRequireDefault(require("../data/account"));

var _account2 = _interopRequireDefault(require("../models/account.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class AccountService
 * @description handles the request coming from the user controller.
 * @exports AccountService
 */
var AccountService =
/*#__PURE__*/
function () {
  function AccountService() {
    _classCallCheck(this, AccountService);
  }

  _createClass(AccountService, null, [{
    key: "generateAccountNumber",

    /**
     * @description generates an account number
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof AccountService
     */
    value: function generateAccountNumber() {
      var accountNumber = 2000000000;
      var accountUsersLength = _account.default.accounts.length;

      if (accountUsersLength === 0) {
        accountNumber = 2000000000;
      }

      var lastAccountNumber = _account.default.accounts[accountUsersLength - 1].accountNumber;
      accountNumber = lastAccountNumber + 1;
      return accountNumber;
    }
    /**
     * @description finds a bank account with accountNumber
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof AccountService
     */

  }, {
    key: "findAccountByAccountNumber",
    value: function findAccountByAccountNumber(accountNumber) {
      var parseAccountNumber = parseInt(accountNumber, Number);

      var foundAccount = _account.default.accounts.find(function (account) {
        return parseAccountNumber === account.accountNumber;
      }); // checks if the account does not exist


      if (!foundAccount) {
        var response = {
          error: true,
          message: 'No account found/Incorrect account number'
        };
        return response;
      }

      return foundAccount;
    }
    /**
     * @description finds a bank account with accountNumber
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof AccountService
     */

  }, {
    key: "checkDormantAccount",
    value: function checkDormantAccount(accountNumber) {
      var foundAccount = this.findAccountByAccountNumber(accountNumber); // checks if the account is dormant

      if (foundAccount.status === 'dormant') {
        return true;
      }

      return false;
    }
    /**
     * @description User can create account
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof AccountService
     */

  }, {
    key: "createAccount",
    value: function createAccount(accountDetails) {
      var firstName = accountDetails.firstName,
          lastName = accountDetails.lastName,
          email = accountDetails.email,
          owner = accountDetails.owner,
          type = accountDetails.type,
          status = accountDetails.status,
          balance = accountDetails.balance;
      var createdOn = (0, _moment.default)().format('DD-MM-YYYY');
      var accountUsersLength = _account.default.accounts.length;
      var lastAccountCreatedId = _account.default.accounts[accountUsersLength - 1].id;
      var id = lastAccountCreatedId + 1;
      var accountNumber = this.generateAccountNumber();
      var newAccount = new _account2.default(id, accountNumber, createdOn, owner, type, status, balance);
      _account.default.accounts = [].concat(_toConsumableArray(_account.default.accounts), [newAccount]);
      var response = {
        accountNumber: newAccount.accountNumber,
        firstName: firstName,
        lastName: lastName,
        email: email,
        type: type,
        openingBalance: parseFloat(newAccount.balance),
        status: status
      };
      return response;
    }
    /**
     * @description Admin/Staff can activate or deactivate a bank account
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof AccountService
     */

  }, {
    key: "changeStatus",
    value: function changeStatus(status, accountNumber) {
      var parseAccountNumber = parseInt(accountNumber, Number);
      var foundAccount = this.findAccountByAccountNumber(parseAccountNumber);

      if (foundAccount.error) {
        return foundAccount;
      }

      foundAccount.status = status;
      var response = {
        accountNumber: foundAccount.accountNumber,
        status: status
      };
      return response;
    }
    /**
     * @description Admin/Staff can activate or deactivate a bank account
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof AccountService
     */

  }, {
    key: "deleteAccount",
    value: function deleteAccount(accountNumber) {
      var parseAccountNumber = parseInt(accountNumber, Number); // this checks if the account exist by using the account number

      var foundAccount = this.findAccountByAccountNumber(parseAccountNumber);

      if (foundAccount.error) {
        return foundAccount;
      } // this filter the dummy account and removes the matching id


      _account.default.accounts = _account.default.accounts.filter(function (account) {
        return account.accountNumber !== parseAccountNumber;
      });
      var response = {
        message: 'Account successfully deleted'
      };
      return response;
    }
  }]);

  return AccountService;
}();

var _default = AccountService;
exports.default = _default;