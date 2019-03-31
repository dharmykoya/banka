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
    if(!accountUsersLength) {
      return accountNumber;
    }
    const lastAccountNumber = AccountData.accounts[accountUsersLength - 1].accountNumber;
    accountNumber = lastAccountNumber++;    
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
    const { owner, type, status, balance } = accountDetails;
    const createdOn = new Date();
    const accountUsersLength = AccountData.accounts.length;
    const lastAccountCreatedId = AccountData.accounts[accountUsersLength - 1].id;
    const id = lastAccountCreatedId + 1;
    const newAccount = new Account(id, accountNumber, createdOn, owner, type, status, balance);
    const Accounts = [...AccountData.accounts, newAccount];   
    return newAccount;
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
      const response = {error: true, message: 'Account does not exist and status can not be updated'};
      return response;
    }
    foundAccount.status = state;
    return foundAccount;
  }

  /**
   * @description Admin/Staff can activate or deactivate a bank account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof AccountService
   */
  static deleteAccount(id) {
    const parseId = parseInt(id, Number);

    // this checks if the account exist by using the id
    const foundAccount = AccountData.accounts.find(account => parseId === account.id);
    if(!foundAccount){
      const response = {error: true, message: 'Account does not exist and can not be deleted'};
      return response;
    }

    // this filter the dummy account and removes the matching id
    const newAccountsList = AccountData.accounts.filter(account => account.id !== parseId);
    const response = {message: 'Account deleted successfully'};
    return response;
  }
}

export default AccountService;
