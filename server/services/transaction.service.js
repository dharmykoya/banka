/* eslint-disable max-len */
import Helper from './helper';
import Mail from './mail';
import UserService from './user.service';
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
   * @param {Object} userAccountNumber
   * @param {Object} tranAmount
   * @param {Object} cashier
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
      const user = await UserService.findUserById(foundAccount.owner);

      if (transaction.error) {
        throw transaction;
      }
      // updating the account record after transaction is successfull
      await AccountService.updateAccountBalance(transaction.accountBalance, parseAccountNumber);
      const payload = Helper.transactionPayload(user, transaction);
      await Mail.sendMail(payload);
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
   * @param {Object} accountNumber
   * @param {Object} amount
   * @param {Object} cashier
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
      const user = await UserService.findUserById(foundAccount.owner);

      if (transaction.error) {
        throw transaction.err;
      }
      // updating the account record after transaction is successfull
      await AccountService.updateAccountBalance(transaction.accountBalance, parseAccountNumber);
      response = transaction;
      const payload = Helper.transactionPayload(user, transaction);
      await Mail.sendMail(payload);
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description makes the transaction depending on the type
   * @static
   * @param {Object} type
   * @param {Object} cashier
   * @param {Object} parseAccountNumber
   * @param {Object} parseAmount
   * @param {Object} oldBalance
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
      return { ...Helper.transactionReturn(newTransaction, cashier, newBalance, type) };
    } catch (err) {
      const response = { error: true, err };
      return response;
    }
  }

  /**
   * @description get a single transaction
   * @static
   * @param {Object} user
   * @param {Object} transactionId
   * @returns {Object} returns the transaction details
   * @memberof TransactionService
   */
  static async getTransaction(user, transactionId) {
    const parseTransactionId = parseInt(transactionId, Number);
    const column = 'id';
    let response;
    try {
      const { type } = user;
      if (type === 'client') {
        const singleTransaction = await this.getSingleClientTransaction(user, transactionId);
        if (singleTransaction.error) {
          throw singleTransaction.err;
        }
        return singleTransaction;
      }
      const model = new Model('transactions');
      const singleTransaction = await model.FindOne(column, parseTransactionId);
      if (singleTransaction === undefined || singleTransaction.name === 'error') {
        response = 'invalid transaction detail provided';
        throw response;
      }
      return singleTransaction;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description get a single transaction for client
   * @static
   * @param {Object} user
   * @param {Object} transactionId
   * @returns {Object} returns the transaction details
   * @memberof TransactionService
   */
  static async getSingleClientTransaction(user, transactionId) {
    const parseTransactionId = parseInt(transactionId, Number);
    const { id } = user;
    let response;
    try {
      const model = new Model('transactions');
      const column = 'id';
      const singleTransaction = await model.FindOne(column, parseTransactionId);
      if (singleTransaction === undefined || singleTransaction.name === 'error') {
        response = 'Invalid transaction detail provided';
        throw response;
      }
      const accountNumber = singleTransaction.account_number;
      const clientAccount = await AccountService.findAccountByAccountNumber(accountNumber);
      if (clientAccount.error) {
        throw clientAccount;
      }
      if (id === clientAccount.owner) {
        return singleTransaction;
      }
      response = 'You are not Authorized to view this transaction';
      throw response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }
}

export default TransactionService;
