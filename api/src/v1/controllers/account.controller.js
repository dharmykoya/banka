import AccountService from '../services/account.service';

/**
 * @class AccountController
 * @description handles the request coming from the user route and interacts with the user service class
 * @exports AccountController
 */

 class AccountController {
     /**
      * @description User can create a bank account
      * @static 
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof UserController
      */
     static createAccount(req, res) {
      const accountDetails = req.body;
      const newAccount = AccountService.createAccount(accountDetails);
      if(newAccount.error) {
       return res.status(201).send({
         status: 400,
         error: newAccount.message,  
       });
      }
      return res.status(201).send({
       status: 201,
       data: newAccount,  
     });
    }
 }

 export default AccountController;