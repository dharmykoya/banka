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
};

export default Helper;
