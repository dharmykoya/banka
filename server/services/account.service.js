/* eslint-disable max-len */
import Helper from './helper';
import Model from '../models/Model';
import UserService from './user.service';

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
   * @param {Object} accountNumber
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
    if (!foundAccount || foundAccount.name === 'error') {
      const response = { error: true, message: 'No account found/Incorrect account number' };
      return response;
    }
    return foundAccount;
  }

  /**
   * @description finds a bank account with userId
   * @static
   * @param {Object} userId
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async findAccountByUserId(userId) {
    const parseUserId = parseInt(userId, Number);
    const model = new Model('accounts');
    const foundAccount = await model.FindAccountById(parseUserId);
    // checks if the account does not exist
    if (!foundAccount || foundAccount.name === 'error') {
      const response = { error: true, message: 'No account found/Incorrect account number' };
      return response;
    }
    return foundAccount;
  }

  /**
   * @description finds a bank account with accountNumber
   * @static
   * @param {Object} accountNumber
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async checkDormantAccount(accountNumber) {
    const foundAccount = await this.findAccountByAccountNumber(accountNumber);

    // checks if the account is dormant
    if (foundAccount.status === 'dormant') {
      return true;
    }
    return false;
  }

  /**
   * @description User can create account
   * @static
   * @param {Object} accountDetails
   * @param {Object} type
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
      if (newAccount.name === 'error' || newAccount === undefined) {
        response = 'User not found, please check the request';
        throw response;
      }
      response = { ...Helper.accountReturn(newAccount, accountDetails, email, type) };
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description Admin/Staff can activate or deactivate a bank account
   * @static
   * @param {Object} status
   * @param {Object} accountNumber
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async changeStatus(status, accountNumber) {
    let response;
    try {
      const type = ['active', 'dormant'];
      if (type.includes(status)) {
        const parseAccountNumber = parseInt(accountNumber, Number);
        const foundAccount = await this.findAccountByAccountNumber(parseAccountNumber);
        if (foundAccount.error) {
          response = foundAccount.message;
          throw response;
        }
        const model = new Model('accounts');
        const updateAccount = await model.UpdateAccountStatus(status, foundAccount.account_number);
        if (updateAccount.name === 'error' || updateAccount === undefined) {
          response = updateAccount.message;
          throw response;
        }
        response = {
          accountNumber: foundAccount.account_number,
          status,
        };
        return response;
      }
      response = 'Invalid status';
      throw response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description Admin/Staff delete a bank account
   * @static
   * @param {Object} accountNumber
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
      await model.DeleteAccount(foundAccount.account_number);
      // this filter the dummy account and removes the matching id
      response = `Account Number ${foundAccount.account_number} successfully deleted`;
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description updates a bank account
   * @static
   * @param {Object} balance
   * @param {Object} accountNumber
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async updateAccountBalance(balance, accountNumber) {
    let response;
    try {
      const model = new Model('accounts');
      const updateAccountBalance = await model.UpdateAccountBalance(balance, accountNumber);
      if (updateAccountBalance.name === 'error' || updateAccountBalance === undefined) {
        response = updateAccountBalance.message;
        throw response;
      }
      response = 'success';
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description returns all transactions for a particular account number
   * @static
   * @param {Object} accountNumber
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async allTransactions(accountNumber) {
    let response;
    const parseAccountNumber = parseInt(accountNumber, Number);
    try {
      const column = 'account_number';
      const model = new Model('transactions');
      const allTransactions = await model.Find(column, parseAccountNumber);
      if (allTransactions.name === 'error' || allTransactions === undefined) {
        response = allTransactions.message;
        throw response;
      }
      return allTransactions;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description returns a the details of an account
   * @static
   * @param {Object} accountNumber
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async accountDetails(accountNumber) {
    let response;
    try {
      const parseAccountNumber = parseInt(accountNumber, Number);
      const column = 'account_number';
      const model = new Model('accounts');
      const accountDetails = await model.FindOne(column, parseAccountNumber);
      if (accountDetails === undefined || accountDetails.name === 'error') {
        response = 'Account number not found';
        throw response;
      }
      const user = await UserService.findUserById(accountDetails.owner);
      const { email } = user;

      response = { ...accountDetails, email };
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description returns a the details of an account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async allAccounts() {
    const secondTable = 'users';
    const model = new Model('accounts');
    const allAccounts = await model.FindAllAccounts(secondTable);
    const response = allAccounts;
    return response;
  }

  /**
   * @description returns a type of accounts
   * @static
   * @param {Object} status
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async statusAccounts(status) {
    let response;
    try {
      const type = ['active', 'dormant'];
      if (type.includes(status)) {
        const secondTable = 'users';
        const model = new Model('accounts');
        const allAccounts = await model.FindStatusAccount(status, secondTable);
        response = allAccounts;
        return response;
      }
      response = 'Invalid status';
      throw response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }
}

export default AccountService;
