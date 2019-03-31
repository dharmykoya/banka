import TransactionService from '../services/transaction.service';

/**
 * @class TransactionController
 * @description handles the request coming from the transaction route and interacts with the transaction service class
 * @exports TransactionController
 */

 class TransactionController {
     /**
      * @description Credit a User bank account
      * @static 
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof TransactionController
      */
     static creditAccount(req, res) {
       const {amount} = req.body;
       const accountNumber = req.params.accountNumber;
       const creditedAccount = TransactionService.creditAccount(accountNumber, amount);
       if(creditedAccount.error) {
        return res.status(401).send({
          status: 401,
          error: creditedAccount.message,  
        });
       }
       return res.status(201).send({
        status: 200,
        data: creditedAccount,  
      });
     }

      /**
      * @description Debit a User bank account
      * @static 
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof TransactionController
      */
     static debitAccount(req, res) {
      const {amount} = req.body;
      const accountNumber = req.params.accountNumber;
      const debitedAccount = TransactionService.debitAccount(accountNumber, amount);
      if(debitedAccount.error) {
       return res.status(401).send({
         status: 401,
         error: debitedAccount.message,  
       });
      }
      return res.status(201).send({
       status: 201,
       data: debitedAccount,  
     });
    }
     
 }

 export default TransactionController;