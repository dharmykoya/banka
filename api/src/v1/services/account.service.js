/* eslint-disable max-len */
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
      return accountNumber;
    }
    const lastAccountNumber = AccountData.accounts[accountUsersLength - 1].accountNumber;
    accountNumber = lastAccountNumber + 1;
    return accountNumber;
  }

  /**
   * @description User can create account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static fetchAllAccounts() {
    return AccountData.accounts.map((account) => {
      const accounts = new Account(
        account.id,
        account.accountNumber,
        account.createdOn,
        account.owner,
        account.type,
        account.status,
        account.balance,
      );
      return accounts;
    });
  }

  /**
   * @description User can create account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static createAccount(accountDetails) {
    const {
      firstName, lastName, email, owner, type, status, balance,
    } = accountDetails;
    if (!firstName || !lastName || !email || !type) {
      const response = { error: true, message: 'missing parameters, please fill all fields' };
      return response;
    }
    const createdOn = new Date();
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
    // const statuses = ['active', 'dormant'];
    // if (!statuses.includes(status)) {
    //   const response = { error: true, message: 'Invalid status' };
    //   return response;
    // }

    const parseAccountNumber = parseInt(accountNumber, Number);
    const foundAccount = AccountData.accounts.find(account => parseAccountNumber === account.accountNumber);

    if (!foundAccount) {
      const response = { error: true, message: 'Account does not exist and status can not be updated' };
      return response;
    }
    foundAccount.status = status;
    // return foundAccount;
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

    // this checks if the account exist by using the id
    const foundAccount = AccountData.accounts.find(account => parseAccountNumber === account.accountNumber);
    if (!foundAccount) {
      const response = { error: true, message: 'Account does not exist and can not be deleted' };
      return response;
    }

    // this filter the dummy account and removes the matching id
    // const newAccountsList = AccountData.accounts.filter(account => account.accountNumber !== parseAccountNumber);
    const response = { message: 'Account successfully deleted' };
    return response;
  }
}

export default AccountService;
