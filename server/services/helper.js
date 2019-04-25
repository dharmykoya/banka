import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserData from '../data/user';

dotenv.config();


const Helper = {
  /**
   * Gnerate Token
   * @param {string} user
   * @returns {string} token
   */
  generateToken(user) {
    const token = jwt.sign(
      { user },
      process.env.JWT_SECRET,
      { expiresIn: '7h' }
    );
    return token;
  },

  /**
   * Error format
   * @param {string} res
   * @param {string} statusCode
   * @param {string} error
   * @returns {object} error format
   */
  errorResponse(res, statusCode, error) {
    return res.status(statusCode).send({
      status: statusCode,
      error,
    });
  },

  /**
   * @description Check if email exist
   * @static
   * @param {Object} email
   * @returns {boolean} true or false
   */
  checkEmailExist(email) {
    const foundUser = UserData.users.find(user => email === user.email);
    // checks if the user exist
    if (foundUser) {
      return true;
    }
    return false;
  },

  /**
   * @description returns errors during validation
   * @static
   * @param {Object} errors
   * @returns {array} array of errors
   */
  validationError(errors) {
    const err = errors.map(error => error.msg);
    return err;
  },

  /**
   * Hash Password Method
   * @param {string} pass
   * @returns {string} returns hashed password
   */
  hashPassword(pass) {
    const password = bcrypt.hashSync(pass, bcrypt.genSaltSync(8));
    return password;
  },

  /**
   * comparePassword
   * @param {string} password
   * @param {string} hashPassword
   * @returns {Boolean} return True or False
   */
  comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  },

  /**
   * return format for transactions (credit or debit)
   * @param {object} newTransaction
   * @param {integer} cashier
   * @param {integer} newBalance
   * @param {string} type
   * @returns {object} transaction return format
   */
  transactionReturn(newTransaction, cashier, newBalance, type) {
    return {
      transactionId: newTransaction.id,
      accountNumber: newTransaction.account_number,
      amount: newTransaction.amount,
      cashier,
      transactionType: type,
      accountBalance: parseFloat(newBalance, 2).toString(),
    };
  },

  /**
   * return format for create account
   * @param {object} newAccount
   * @param {integer} accountDetails
   * @param {integer} email
   * @param {string} type
   * @returns {object} account return format
   */
  accountReturn(newAccount, accountDetails, email, type) {
    return {
      accountNumber: newAccount.account_number,
      firstName: accountDetails.firstName,
      lastName: accountDetails.lastName,
      email,
      type,
      openingBalance: parseFloat(newAccount.balance),
      status: newAccount.status,
    };
  },
  /**
   * return format for user
   * @param {object} newUser
   * @returns {object} user return format
   */
  userReturn(newUser) {
    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      type: newUser.type,
      isAdmin: newUser.admin,
    };
  },

  /**
   * return format for user token
   * @param {string} newUser
   * @returns {string} error format
   */
  tokenReturn(newUser) {
    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      type: newUser.type,
      isAdmin: newUser.admin,
    };
  },

  /**
   * return format for newUser mail
   * @param {string} email
   * @param {string} subject
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} message
   * @returns {string} error format
   */
  newUserPayload(email, subject, firstName, lastName, message) {
    const payload = {
      email,
      subject,
      firstName,
      lastName,
      message,
    };
    return payload;
  },

  /**
   * return mail format for transactions (credit or debit)
   * @param {string} user
   * @param {string} newTransaction
   * @returns {string} mail format
   */
  transactionPayload(user, newTransaction) {
    const payload = {
      email: user.email,
      subject: `${newTransaction.type} Transaction from Banka`,
      firstName: user.first_name,
      lastName: user.last_name,
      message: `Amount: ${newTransaction.amount}<br>
                New Balance: ${newTransaction.new_balance}`,
    };
    return payload;
  },
};

export default Helper;
