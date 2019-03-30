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
        account.balance
      )
      return accounts;
    })
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
    const { accountNumber, owner, type, status, balance } = accountDetails;
    const createdOn = new Date();
    const accountUsersLength = AccountData.accounts.length;
    const lastAccountCreatedId = AccountData.accounts[accountUsersLength - 1].id;
    const id = lastAccountCreatedId + 1;
    const newAccount = new Account(id, accountNumber, createdOn, owner, type, status, balance);
    const Accounts = [...AccountData.accounts, newAccount];    
    return Accounts;
  }

  /**
   * @description Admin/Staff can activate or deactivate a bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static changeStatus (id, state) {
    const foundAccount = AccountData.accounts.find(account => id === account.id);
    if(!foundAccount) {
      const response = {error: true, message: 'Account does not exist'};
      return response;
    }
    foundAccount.status = state;
    return foundAccount;
  }
}

export default AccountService;
