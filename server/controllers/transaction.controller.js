/* eslint-disable max-len */
import TransactionService from '../services/transaction.service';

/**
 * @class TransactionController
 * @description handles the request coming from the transaction route and interacts with the transaction service class
 * @exports TransactionController
 */
class TransactionController {
  /**
      * @description Credit a User bank account
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof TransactionController
      */
  static async creditAccount(req, res) {
    const { amount } = req.body;
    const { accountNumber } = req.params;
    const { id } = req.decoded.user;
    const cashier = id;
    try {
      const creditedAccount = await TransactionService.creditAccount(accountNumber, amount, cashier);
      if (creditedAccount.error) {
        throw creditedAccount;
      }
      return res.status(201).send({
        status: 201,
        data: creditedAccount,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description Debit a User bank account
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof TransactionController
      */
  static async debitAccount(req, res) {
    const { amount } = req.body;
    const { id } = req.decoded.user;
    const cashier = id;
    const { accountNumber } = req.params;
    try {
      const debitedAccount = await TransactionService.debitAccount(accountNumber, amount, cashier);
      if (debitedAccount.error) {
        throw debitedAccount;
      }
      return res.status(201).send({
        status: 201,
        data: debitedAccount,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description get single transaction
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof TransactionController
      */
  static async getTransaction(req, res) {
    const { transactionId } = req.params;
    const { user } = req.decoded;
    try {
      const transaction = await TransactionService.getTransaction(user, transactionId);
      if (transaction.error) {
        throw transaction;
      }
      return res.status(201).send({
        status: 201,
        data: transaction,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }
}

export default TransactionController;
