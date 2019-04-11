/* eslint-disable max-len */
import moment from 'moment';
import AccountData from '../data/account';
import Account from '../models/account.model';

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
  static generateAccountNumber() {
    let accountNumber = 2000000000;
    const accountUsersLength = AccountData.accounts.length;
    if (accountUsersLength === 0) {
      accountNumber = 2000000000;
    }
    const lastAccountNumber = AccountData.accounts[accountUsersLength - 1].accountNumber;
    accountNumber = lastAccountNumber + 1;
    return accountNumber;
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
  static createAccount(accountDetails, type) {
    const {
      firstName, lastName, email, owner,
    } = accountDetails;

    const createdOn = moment().format('DD-MM-YYYY');
    const balance = parseFloat(2000);
    const status = 'active';
    const accountUsersLength = AccountData.accounts.length;
    const lastAccountCreatedId = AccountData.accounts[accountUsersLength - 1].id;
    const id = lastAccountCreatedId + 1;
    const accountNumber = this.generateAccountNumber();
    const newAccount = new Account(id, accountNumber, createdOn, owner, type, status, balance);
    AccountData.accounts = [...AccountData.accounts, newAccount];
    const response = {
      accountNumber: newAccount.accountNumber,
      firstName,
      lastName,
      email,
      type,
      openingBalance: parseFloat(newAccount.balance),
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
