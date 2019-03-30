import AccountData from '../data/account';
import Account from '../models/account.model';

/**
 * @class AccountService
 * @description handles the request coming from the user controller.
 * @exports AccountService
 */

class AccountService {
  /**
   * @description User can create account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof UserService
   */
  static createAccount(accountDetails) {
    const { accountNumber, owner, type, status, balance } = accountDetails;
    const createdOn = new Date();
    const accountUsersLength = AccountData.accounts.length;
    const lastAccountCreatedId = AccountData.accounts[accountUsersLength - 1].id;
    const id = lastAccountCreatedId + 1;
    const newAccount = new Account(id, accountNumber, createdOn, owner, type, status, balance);
    const Accounts = [...AccountData.accounts, newAccount];    
    return Accounts;
  }
}

export default AccountService;
