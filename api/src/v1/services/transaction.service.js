import AccountData from '../data/account';
import TransactionData from '../data/transaction';
import Transaction from '../models/transaction.model';

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
  static creditAccount(accountNumber, amount) { 
    const newamount = parseFloat(amount)   ;
    const parseAccountNumber = parseInt(accountNumber, Number);
    const foundAccount = AccountData.accounts.find(account => parseAccountNumber === account.accountNumber);
    
    // checks if the account does not exist
    if(!foundAccount) {
      const response = {error: true, message: 'No account found/Incorrect account number'};
      return response;
    } 

    // checks if the account is dormant
    if (foundAccount.status === 'dormant') {
      const response = {error: true, message: 'Account is dormant. Please reactivate.'};
      return response;
    }

    const transactionLength = TransactionData.transactions.length;
    const lastTransactionId = TransactionData.transactions[transactionLength - 1].id;
    const id = lastTransactionId + 1;
    const createdOn = new Date();
    const type = 'credit';
    const cashier = 1;

    const oldBalance = parseFloat(foundAccount.balance);
    const newBalance = oldBalance + newamount;
    // creating a new instance of the Transaction
    const transaction = new Transaction (
      id, 
      createdOn, 
      type, 
      accountNumber, 
      cashier, 
      amount, 
      oldBalance, 
      newBalance
    );
    const response = {
      transactionId: id,
      accountNumber: accountNumber,
      amount,
      cashier,
      transactionType: type,
      accountBalance: newBalance.toString()
    }
    return response;
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
    const minBalance = parseFloat(1000);
    const newamount = parseFloat(amount)   ;
    const parseAccountNumber = parseInt(accountNumber, Number);
    const foundAccount = AccountData.accounts.find(account => parseAccountNumber === account.accountNumber);
    
    // checks if the account does not exist
    if(!foundAccount) {
      const response = {error: true, message: 'No account found/Incorrect account number'};
      return response;
    } 

    // checks if the account is dormant
    if (foundAccount.status === 'dormant') {
      const response = {error: true, message: 'Account is dormant. Please reactivate.'};
      return response;
    }

    // checks if the amount to withdraw is greater than the account balance
    if (foundAccount.balance < newamount){
      const response = {error: true, message: 'Insufficient Balance.'};
      return response;
    }

    const transactionLength = TransactionData.transactions.length;
    const lastTransactionId = TransactionData.transactions[transactionLength - 1].id;
    const id = lastTransactionId + 1;
    const createdOn = new Date();
    const type = 'debit';
    const cashier = 1;

    const oldBalance = parseFloat(foundAccount.balance);
    const newBalance = oldBalance - newamount;

    if (newBalance < minBalance){
      const response = {error: true, message: `You can not have less than ${minBalance} in your account.`};
      return response;
    }
    // creating a new instance of the Transaction
    const transaction = new Transaction (
      id, 
      createdOn, 
      type, 
      accountNumber, 
      cashier, 
      amount, 
      oldBalance, 
      newBalance
    );
    const response = {
      transactionId: id,
      accountNumber: accountNumber,
      amount,
      cashier,
      transactionType: type,
      accountBalance: newBalance.toString()
    }
    return response;
  }
  
}

export default TransactionService;