/* eslint-disable max-len */
import TransactionService from '../services/transaction.service';
import Helper from '../services/helper';

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
  static creditAccount(req, res) {
    const { amount } = req.body;
    const { accountNumber } = req.params;
    const { id } = req.decoded.user;
    const cashier = id;
    const creditedAccount = TransactionService.creditAccount(accountNumber, amount, cashier);
    if (creditedAccount.error) {
      return Helper.errorResponse(res, 400, creditedAccount.message);
    }
    return res.status(201).send({
      status: 201,
      data: creditedAccount,
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
  static debitAccount(req, res) {
    const { amount } = req.body;
    const { id } = req.decoded.user;
    const cashier = id;
    const { accountNumber } = req.params;
    const debitedAccount = TransactionService.debitAccount(accountNumber, amount, cashier);
    if (debitedAccount.error) {
      return Helper.errorResponse(res, 400, debitedAccount.message);
    }
    return res.status(201).send({
      status: 201,
      data: debitedAccount,
    });
  }
}

export default TransactionController;
