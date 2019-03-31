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
       const transactionDetails = req.body;
       const accountNumber = req.params;
       console.log(accountNumber);
       const creditedAccount = TransactionService.creditAccount(accountNumber, transactionDetails);
       if(creditedAccount.error) {
        return res.status(201).send({
          status: 401,
          error: creditedAccount.message,  
        });
       }
       return res.status(201).send({
        status: 201,
        data: creditedAccount,  
      });
     }
     
 }

 export default TransactionController;