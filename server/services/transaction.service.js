/* eslint-disable max-len */
import AccountService from './account.service';
import Model from '../models/Model';

/**
 * @class UserService
 * @description handles the request coming from the service controller.
 * @exports TransactionService
 */

class TransactionService {
  /**
   * @description credit a bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof TransactionService
   */
  static async creditAccount(userAccountNumber, tranAmount, cashier) {
    let response;
    const parseAmount = parseFloat(tranAmount);
    const parseAccountNumber = parseInt(userAccountNumber, Number);
    try {
      const foundAccount = await AccountService.findAccountByAccountNumber(parseAccountNumber);

      // checks if the account does not exist
      if (foundAccount.error) {
        response = foundAccount.message;
        throw response;
      }
      // checks if the account is dormant
      const dormantAccount = await AccountService.checkDormantAccount(parseAccountNumber);
      if (dormantAccount) {
        response = 'Account is dormant. Please reactivate.';
        throw response;
      }
      const type = 'credit';
      const oldBalance = parseFloat(foundAccount.balance);
      const transaction = await this.transactionAction(type, cashier, parseAccountNumber, parseAmount, oldBalance);

      if (transaction.error) {
        throw transaction;
      }
      // updating the account record after transaction is successfull
      await AccountService.updateAccountBalance(transaction.accountBalance, parseAccountNumber);
      response = transaction;
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description debit a bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof TransactionService
   */
  static async debitAccount(accountNumber, amount, cashier) {
    let response;
    const parseAmount = parseFloat(amount);
    const parseAccountNumber = parseInt(accountNumber, Number);
    try {
      const foundAccount = await AccountService.findAccountByAccountNumber(parseAccountNumber);
      // checks if the account does not exist
      if (foundAccount.error) {
        response = foundAccount.message;
        throw response;
      }
      // checks if the account is dormant
      const dormantAccount = await AccountService.checkDormantAccount(parseAccountNumber);
      if (dormantAccount) {
        response = 'Account is dormant. Please reactivate.';
        throw response;
      }
      const type = 'debit';
      const oldBalance = parseFloat(foundAccount.balance);
      if (parseAmount > oldBalance) {
        response = 'Insufficient Balance.';
        throw response;
      }
      const transaction = await this.transactionAction(type, cashier, parseAccountNumber, parseAmount, oldBalance);

      if (transaction.error) {
        throw transaction.err;
      }
      // updating the account record after transaction is successfull
      await AccountService.updateAccountBalance(transaction.accountBalance, parseAccountNumber);
      response = transaction;
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description makes the transaction depending on the type
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof TransactionService
   */
  static async transactionAction(type, cashier, parseAccountNumber, parseAmount, oldBalance) {
    let newBalance;
    const minBalance = parseFloat(1000);
    // const createdOn = moment().format('DD-MM-YYYY');
    try {
      if (type === 'credit') {
        newBalance = oldBalance + parseAmount;
      } else if (type === 'debit') {
        newBalance = oldBalance - parseAmount;
        // checks if the amount to withdraw is greater than the account balance
        if (newBalance < minBalance) {
          const response = { message: `You can not have less than ${minBalance} in your account.` };
          throw response.message;
        }
      }
      // creating a new Transaction
      const model = new Model('transactions');
      const newTransaction = await model.InsertTransaction(type, parseAccountNumber, cashier, parseAmount, oldBalance, newBalance);

      const response = {
        transactionId: newTransaction.id,
        accountNumber: newTransaction.account_number,
        amount: newTransaction.amount,
        cashier,
        transactionType: type,
        accountBalance: parseFloat(newBalance, 2).toString(),
      };
      return response;
    } catch (err) {
      const response = { error: true, err };
      return response;
    }
  }

  /**
   * @description get a particular transaction
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the transaction details
   * @memberof TransactionService
   */
  static async getTransaction(transactionId) {
    const parseTransactionId = parseInt(transactionId, Number);
    const column = 'id';
    let response;
    try {
      const model = new Model('transactions');
      const singleTransaction = await model.FindOne(column, parseTransactionId);
      if (singleTransaction.name === 'error' || singleTransaction === undefined) {
        response = 'invalid transaction detail provided';
        throw response;
      }
      return singleTransaction;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }
}

export default TransactionService;
