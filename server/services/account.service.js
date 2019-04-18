/* eslint-disable max-len */
import AccountData from '../data/account';
import Model from '../models/Model';

/**
 * @class AccountService
 * @description handles the request coming from the user controller.
 * @exports AccountService
 */

class AccountService {
  /**
   * @description generates an account number
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async generateAccountNumber() {
    let accountNumber = 2000000000;
    let response;
    try {
      const model = new Model('accounts');
      const lastAccountNumber = await model.FindLastAccountNumber();
      if (lastAccountNumber.length === 0) {
        accountNumber = 2000000000;
      } else {
        accountNumber = lastAccountNumber[0].account_number;
      }
      if (lastAccountNumber.name === 'error') {
        throw lastAccountNumber.message;
      }
      accountNumber += 1;
      return parseInt(accountNumber, Number);
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description finds a bank account with accountNumber
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static findAccountByAccountNumber(accountNumber) {
    const parseAccountNumber = parseInt(accountNumber, Number);

    const foundAccount = AccountData.accounts.find(account => parseAccountNumber === account.accountNumber);

    // checks if the account does not exist
    if (!foundAccount) {
      const response = { error: true, message: 'No account found/Incorrect account number' };
      return response;
    }
    return foundAccount;
  }

  /**
   * @description finds a bank account with accountNumber
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static checkDormantAccount(accountNumber) {
    const foundAccount = this.findAccountByAccountNumber(accountNumber);
    // checks if the account is dormant
    if (foundAccount.status === 'dormant') {
      return true;
    }
    return false;
  }

  /**
   * @description User can create account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async createAccount(accountDetails, type) {
    let response;
    const { id, email } = accountDetails;
    try {
      const accountNumber = await this.generateAccountNumber();
      if (accountNumber.error) {
        throw accountNumber;
      }
      const model = new Model('accounts');
      const balance = parseFloat(2000);
      const newAccount = await model.InsertAccount(accountNumber, id, type, balance);
      if (newAccount.name === 'error') {
        response = newAccount.message;
        throw response;
      }
      response = {
        accountNumber: newAccount.account_number,
        firstName: accountDetails.firstName,
        lastName: accountDetails.lastName,
        email,
        type,
        openingBalance: parseFloat(newAccount.balance),
        status: newAccount.status,
      };
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description Admin/Staff can activate or deactivate a bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static changeStatus(status, accountNumber) {
    const parseAccountNumber = parseInt(accountNumber, Number);
    const foundAccount = this.findAccountByAccountNumber(parseAccountNumber);
    if (foundAccount.error) {
      return foundAccount;
    }
    foundAccount.status = status;
    const response = {
      accountNumber: foundAccount.accountNumber,
      status,
    };
    return response;
  }

  /**
   * @description Admin/Staff can activate or deactivate a bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static deleteAccount(accountNumber) {
    const parseAccountNumber = parseInt(accountNumber, Number);

    // this checks if the account exist by using the account number
    const foundAccount = this.findAccountByAccountNumber(parseAccountNumber);
    if (foundAccount.error) {
      return foundAccount;
    }

    // this filter the dummy account and removes the matching id
    AccountData.accounts = AccountData.accounts.filter(account => account.accountNumber !== parseAccountNumber);
    const response = { message: 'Account successfully deleted' };
    return response;
  }
}

export default AccountService;
