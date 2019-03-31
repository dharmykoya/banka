/* eslint-disable max-len */
import AccountService from '../services/account.service';

/**
 * @class AccountController
 * @description handles the request coming from the user route and interacts with the user service class
 * @exports AccountController
 */

class AccountController {
  /**
      * @description Admin view all bank accounts
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof AccountController
      */
  static allAccounts(req, res) {
    const allAccountsFound = AccountService.fetchAllAccounts();
    return res.status(200).send({
      status: 200,
      data: allAccountsFound,
    });
  }

  /**
      * @description User can create a bank account
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof AccountController
      */
  static createAccount(req, res) {
    const accountDetails = req.body;
    const newAccount = AccountService.createAccount(accountDetails);
    if (newAccount.error) {
      return res.status(400).send({
        status: 400,
        error: newAccount.message,
      });
    }
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
      return res.status(400).send({
        status: 400,
        error: accountUpdated.message,
      });
    }
    return res.status(204).send({
      status: 204,
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
      return res.status(400).send({
        status: 400,
        error: deleteAccount.message,
      });
    }
    return res.status(202).send({
      status: 202,
      data: deleteAccount,
    });
  }
}

export default AccountController;
