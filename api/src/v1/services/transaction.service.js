//import AccountData from '../data/transaction';
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
    const foundAccount = AccountData.accounts.find(account => accountNumber === account.accountNumber);
    if(!foundAccount) {
      const response = {error: true, message: 'No account found/Incorrect account number'};
      return response;
    } else if (foundAccount.status === 'dormant') {
      const response = {error: true, message: 'Account is dormant. Please reactivate.'};
      return response;
    }

    const transaction = new Transaction (
      transactionId,
      accountNumber,
      amount,
      cashier,
      transactionType,
      accountBalance

    )

    const response = {error: true, message: 'Account is dormant. Please reactivate.'};
    return response;
  }
  
}

export default TransactionService;