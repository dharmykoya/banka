/* eslint-disable max-len */
import AccountService from '../services/account.service';

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
  static async createAccount(req, res) {
    const accountDetails = req.decoded.user;
    const { type } = req.body;
    try {
      const newAccount = await AccountService.createAccount(accountDetails, type);
      if (newAccount.error) {
        throw newAccount;
      }
      return res.status(201).send({
        status: 201,
        data: newAccount,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description Admin/staff can activate or deactivate a bank account
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof AccountController
      */
  static async changeStatus(req, res) {
    const { status } = req.body;
    const { accountNumber } = req.params;
    try {
      const accountUpdated = await AccountService.changeStatus(status, accountNumber);
      if (accountUpdated.error) {
        throw accountUpdated;
      }
      return res.status(200).send({
        status: 200,
        data: accountUpdated,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description Admin/staff can delete a bank account
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof AccountController
      */
  static async deleteAccount(req, res) {
    const { accountNumber } = req.params;
    try {
      const deleteAccount = await AccountService.deleteAccount(accountNumber);
      if (deleteAccount.error) {
        throw deleteAccount;
      }
      return res.status(202).send({
        status: 202,
        data: deleteAccount,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }
}

export default AccountController;
