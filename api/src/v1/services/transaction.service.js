/* eslint-disable max-len */
import moment from 'moment';
import TransactionData from '../data/transaction';
import Transaction from '../models/transaction.model';
import AccountService from './account.service';

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
  static creditAccount(userAccountNumber, tranAmount) {
    const parseAmount = parseFloat(tranAmount);
    const parseAccountNumber = parseInt(userAccountNumber, Number);
    const foundAccount = AccountService.findAccountByAccountNumber(parseAccountNumber);

    // checks if the account does not exist
    if (foundAccount.error) {
      return foundAccount;
    }

    // checks if the account is dormant
    if (foundAccount.status === 'dormant') {
      const response = { error: true, message: 'Account is dormant. Please reactivate.' };
      return response;
    }

    const transactionLength = TransactionData.transactions.length;
    const lastTransactionId = TransactionData.transactions[transactionLength - 1].id;
    const id = lastTransactionId + 1;
    const type = 'credit';
    const tranCashier = 1;
    const oldBalance = parseFloat(foundAccount.balance);

    const transaction = this.transactionAction(type, id, tranCashier, parseAccountNumber, parseAmount, oldBalance);
    // updating the found record
    foundAccount.balance = transaction.accountBalance;

    return transaction;
  }

  /**
   * @description debit a bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof TransactionService
   */
  static debitAccount(accountNumber, amount) {
    const parseAmount = parseFloat(amount);
    const parseAccountNumber = parseInt(accountNumber, Number);
    const foundAccount = AccountService.findAccountByAccountNumber(parseAccountNumber);

    // checks if the account does not exist
    if (foundAccount.error) {
      return foundAccount;
    }

    // checks if the account is dormant
    if (foundAccount.status === 'dormant') {
      const response = { error: true, message: 'Account is dormant. Please reactivate.' };
      return response;
    }

    // checks if the amount to withdraw is greater than the account balance
    if (foundAccount.balance < parseAmount) {
      const response = { error: true, message: 'Insufficient Balance.' };
      return response;
    }

    const transactionLength = TransactionData.transactions.length;
    const lastTransactionId = TransactionData.transactions[transactionLength - 1].id;
    const id = lastTransactionId + 1;
    const type = 'debit';
    const cashier = 1;

    const oldBalance = parseFloat(foundAccount.balance);

    const transaction = this.transactionAction(type, id, cashier, parseAccountNumber, parseAmount, oldBalance);

    // updating the found record
    foundAccount.balance = transaction.accountBalance;

    return transaction;
  }

  /**
   * @description makes the transaction depending on the type
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof TransactionService
   */
  static transactionAction(type, id, cashier, parseAccountNumber, parseAmount, oldBalance) {
    let newBalance;
    let error = false;
    const minBalance = parseFloat(1000);
    const createdOn = moment().format('DD-MM-YYYY');

    // set the transaction action
    switch (type) {
      case 'credit':
        newBalance = oldBalance + parseAmount;
        break;
      case 'debit':
        newBalance = oldBalance - parseAmount;
        // checks if the amount to withdraw is greater than the account balance
        if (newBalance < minBalance) {
          const response = { error: true, message: `You can not have less than ${minBalance} in your account.` };
          return response;
        }
        break;
      default:
        error = true;
    }

    if (error) {
      const response = { error: true, message: 'Something went wrong. How did you get here?' };
      return response;
    }

    // creating a new instance of the Transaction
    const transaction = new Transaction(
      id,
      createdOn,
      type,
      parseAccountNumber,
      cashier,
      parseAmount,
      oldBalance,
      newBalance,
    );
    TransactionData.transactions = [...TransactionData.transactions, transaction];
    const response = {
      transactionId: id,
      accountNumber: parseAccountNumber,
      amount: parseAmount,
      cashier,
      transactionType: type,
      accountBalance: newBalance.toString(),
    };

    return response;
  }
}

export default TransactionService;
