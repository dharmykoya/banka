"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _account = _interopRequireDefault(require("../services/account.service"));

var _helper = _interopRequireDefault(require("../services/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class AccountController
 * @description handles the request coming from the user route and interacts with the user service class
 * @exports AccountController
 */
var AccountController =
/*#__PURE__*/
function () {
  function AccountController() {
    _classCallCheck(this, AccountController);
  }

  _createClass(AccountController, null, [{
    key: "createAccount",

    /**
    * @description User can create a bank account
    * @static
    * @param {Object} req
    * @param {Object} res
    * @returns {Object} API response
    * @memberof AccountController
    */
    value: function createAccount(req, res) {
      var accountDetails = req.body;

      var newAccount = _account.default.createAccount(accountDetails);

      return res.status(201).send({
        status: 201,
        data: newAccount
      });
    }
    /**
        * @description Admin/staff can activate or deactivate a bank account
        * @static
        * @param {Object} req
        * @param {Object} res
        * @returns {Object} API response
        * @memberof AccountController
        */

  }, {
    key: "changeStatus",
    value: function changeStatus(req, res) {
      var status = req.body.status;
      var accountNumber = req.params.accountNumber;

      var accountUpdated = _account.default.changeStatus(status, accountNumber);

      if (accountUpdated.error) {
        // return res.status(400).send({
        //   status: 400,
        //   error: accountUpdated.message,
        // });
        return _helper.default.errorResponse(res, 400, accountUpdated.message);
      }

      return res.status(200).send({
        status: 200,
        data: accountUpdated
      });
    }
    /**
        * @description Admin/staff can delete a bank account
        * @static
        * @param {Object} req
        * @param {Object} res
        * @returns {Object} API response
        * @memberof AccountController
        */

  }, {
    key: "deleteAccount",
    value: function deleteAccount(req, res) {
      var accountNumber = req.params.accountNumber;

      var deleteAccount = _account.default.deleteAccount(accountNumber);

      if (deleteAccount.error) {
        // return res.status(400).send({
        //   status: 400,
        //   error: deleteAccount.message,
        // });
        return _helper.default.errorResponse(res, 400, deleteAccount.message);
      }

      return res.status(202).send({
        status: 202,
        data: deleteAccount
      });
    }
  }]);

  return AccountController;
}();

var _default = AccountController;
exports.default = _default;