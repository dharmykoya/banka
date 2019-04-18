/* eslint-disable max-len */
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
  static async findAccountByAccountNumber(accountNumber) {
    const parseAccountNumber = parseInt(accountNumber, Number);
    // const column = 'account_number';
    const model = new Model('accounts');
    const foundAccount = await model.FindByAccountNumber(parseAccountNumber);

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
  static async changeStatus(status, accountNumber) {
    let response;
    try {
      const parseAccountNumber = parseInt(accountNumber, Number);
      const foundAccount = await this.findAccountByAccountNumber(parseAccountNumber);
      if (foundAccount.error) {
        response = foundAccount.message;
        throw response;
      }
      const model = new Model('accounts');
      const updateAccount = await model.UpdateAccountStatus(status, foundAccount.account_number);
      if (updateAccount.name === 'error') {
        response = updateAccount.message;
        throw response;
      }
      response = {
        accountNumber: foundAccount.account_number,
        status,
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
  static async deleteAccount(accountNumber) {
    let response;
    const parseAccountNumber = parseInt(accountNumber, Number);
    try {
      // this checks if the account exist by using the account number
      const foundAccount = await this.findAccountByAccountNumber(parseAccountNumber);
      if (foundAccount.error) {
        throw foundAccount.message;
      }
      const model = new Model('accounts');
      const deletedAccount = await model.DeleteAccount(foundAccount.account_number);
      // this filter the dummy account and removes the matching id
      if (deletedAccount.name === 'error') {
        response = deletedAccount.message;
        throw response;
      }
      response = `Account Number ${foundAccount.account_number} successfully deleted`;
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }
}

export default AccountService;
