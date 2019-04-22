import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserData from '../data/user';

dotenv.config();


const Helper = {
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(user) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '7h' });
    return token;
  },

  /**
   * Error format
   * @param {string} statusCode
   * @returns {string} error format
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
   * @returns true or false
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
   * @returns array of errors
   */
  validationError(errors) {
    const err = errors.map(error => error.msg);
    return err;
  },

  /**
     * Hash Password Method
     * @param {string} password
     * @returns {string} returns hashed password
     */
  hashPassword(pass) {
    const password = bcrypt.hashSync(pass, bcrypt.genSaltSync(8));
    return password;
  },

  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  },

  /**
   * return format for transactions (credit or debit)
   * @param {string} statusCode
   * @returns {string} error format
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
   * return format for create Account
   * @param {string} statusCode
   * @returns {string} error format
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
   * return format for new user
   * @param {string} statusCode
   * @returns {string} error format
   */
  userReturn(newUser) {
    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      type: newUser.type,
    };
  },

  /**
   * return format for user token
   * @param {string} statusCode
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
   * @param {string} statusCode
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
   * return format for transactions (credit or debit)
   * @param {string} statusCode
   * @returns {string} error format
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
