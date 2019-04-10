"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transaction = _interopRequireDefault(require("../services/transaction.service"));

var _helper = _interopRequireDefault(require("../services/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class TransactionController
 * @description handles the request coming from the transaction route and interacts with the transaction service class
 * @exports TransactionController
 */
var TransactionController =
/*#__PURE__*/
function () {
  function TransactionController() {
    _classCallCheck(this, TransactionController);
  }

  _createClass(TransactionController, null, [{
    key: "creditAccount",

    /**
        * @description Credit a User bank account
        * @static
        * @param {Object} req
        * @param {Object} res
        * @returns {Object} API response
        * @memberof TransactionController
        */
    value: function creditAccount(req, res) {
      var amount = req.body.amount;
      var accountNumber = req.params.accountNumber;

      var creditedAccount = _transaction.default.creditAccount(accountNumber, amount);

      if (creditedAccount.error) {
        // return res.status(400).send({
        //   status: 400,
        //   error: creditedAccount.message,
        // });
        return _helper.default.errorResponse(res, 400, creditedAccount.message);
      }

      return res.status(201).send({
        status: 201,
        data: creditedAccount
      });
    }
    /**
        * @description Debit a User bank account
        * @static
        * @param {Object} req
        * @param {Object} res
        * @returns {Object} API response
        * @memberof TransactionController
        */

  }, {
    key: "debitAccount",
    value: function debitAccount(req, res) {
      var amount = req.body.amount;
      var accountNumber = req.params.accountNumber;

      var debitedAccount = _transaction.default.debitAccount(accountNumber, amount);

      if (debitedAccount.error) {
        // return res.status(400).send({
        //   status: 400,
        //   error: debitedAccount.message,
        // });
        return _helper.default.errorResponse(res, 400, debitedAccount.message);
      }

      return res.status(201).send({
        status: 201,
        data: debitedAccount
      });
    }
  }]);

  return TransactionController;
}();

var _default = TransactionController;
exports.default = _default;