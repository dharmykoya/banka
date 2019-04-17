/* eslint-disable max-len */
import AccountService from '../services/account.service';
import Helper from '../services/helper';

/**
 * @class AccountController
 * @description handles the request coming from the user route and interacts with the user service class
 * @exports AccountController
 */

class AccountController {
  /**
  * @description User can create a bank account
  * @static
  * @param {Object} req
  * @param {Object} res
  * @returns {Object} API response
  * @memberof AccountController
  */
  static createAccount(req, res) {
    const accountDetails = req.decoded.user;
    const { type } = req.body;
    const newAccount = AccountService.createAccount(accountDetails, type);
    return res.status(201).send({
      status: 201,
      data: newAccount,
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
  static changeStatus(req, res) {
    const { status } = req.body;
    const { accountNumber } = req.params;
    const accountUpdated = AccountService.changeStatus(status, accountNumber);
    if (accountUpdated.error) {
      return Helper.errorResponse(res, 400, accountUpdated.message);
    }
    return res.status(200).send({
      status: 200,
      data: accountUpdated,
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
  static deleteAccount(req, res) {
    const { accountNumber } = req.params;
    const deleteAccount = AccountService.deleteAccount(accountNumber);
    if (deleteAccount.error) {
      return Helper.errorResponse(res, 400, deleteAccount.message);
    }
    return res.status(202).send({
      status: 202,
      data: deleteAccount,
    });
  }
}

export default AccountController;
