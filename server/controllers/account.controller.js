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

  /**
  * @description Returns all the transactions for a particular account number
  * @static
  * @param {Object} req
  * @param {Object} res
  * @returns {Object} API response
  * @memberof AccountController
  */
  static async allTransactions(req, res) {
    const { accountNumber } = req.params;
    const { user } = req.decoded;
    try {
      const allTransactions = await AccountService.allTransactions(user, accountNumber);
      if (allTransactions.error) {
        throw allTransactions;
      }
      return res.status(200).send({
        status: 200,
        data: allTransactions,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
  * @description can view a specific account details
  * @static
  * @param {Object} req
  * @param {Object} res
  * @returns {Object} API response
  * @memberof AccountController
  */
  static async accountDetails(req, res) {
    try {
      const { accountNumber } = req.params;
      const { user } = req.decoded;
      const accountDetails = await AccountService.accountDetails(user, accountNumber);
      if (accountDetails.error) {
        throw accountDetails;
      }
      return res.status(200).send({
        status: 200,
        data: accountDetails,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description Returns all the transactions for a particular account number
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof AccountController
      */
  static async allAccounts(req, res) {
    try {
      const { status } = req.query;
      if (status) {
        const allTransactions = await AccountService.statusAccounts(status);
        if (allTransactions.error) {
          throw allTransactions;
        }
        return res.status(200).send({
          status: 200,
          data: allTransactions,
        });
      }
      const allTransactions = await AccountService.allAccounts();
      if (allTransactions.error) {
        throw allTransactions;
      }
      return res.status(200).send({
        status: 200,
        data: allTransactions,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description Returns all active or dormant accounts
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof AccountController
      */
  static async statusAccounts(req, res) {
    try {
      const { status } = req.query;
      const allTransactions = await AccountService.statusAccounts(status);
      if (allTransactions.error) {
        throw allTransactions;
      }
      return res.status(200).send({
        status: 200,
        data: allTransactions,
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
