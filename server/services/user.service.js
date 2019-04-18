/* eslint-disable max-len */
import Helper from './helper';
import Model from '../models/Model';

/**
 * @class UserService
 * @description handles the request coming from the user controller.
 * @exports UserController
 */

class UserService {
  /**
   * @description Create a User
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof UserService
   */
  static async signUp(user) {
    const {
      email, firstName, lastName, password, type,
    } = user;
    const isAdmin = type === 'client' ? 'false' : 'true';
    try {
      const hashPassword = Helper.hashPassword(password);
      const model = new Model('users');
      const newUser = await model.Insert(email, firstName, lastName, hashPassword, type, isAdmin);
      if (newUser.name === 'error') {
        const response = newUser.message;
        throw response;
      }
      const userToken = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        type: newUser.type,
        isAdmin: newUser.isAdmin,
      };
      // generating token
      const token = Helper.generateToken(userToken);
      return {
        token,
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        type: newUser.type,
      };
    } catch (err) {
      const response = { error: true, err };
      return response;
    }
  }

  /**
   * @description User can signin
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof UserService
   */
  static async loginUser(user) {
    let response;
    const { email, password } = user;
    try {
      const model = new Model('users');
      const foundUser = await model.FindByEmail(email);
      if (!foundUser) {
        response = 'Email is not registered on this app. Please signup.';
        throw response;
      }
      const hashPassword = Helper.comparePassword(password, foundUser.password);
      if (!hashPassword) {
        response = 'Authentication failed.Email/Wrong password.';
        throw response;
      }
      const userToken = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.first_name,
        lastName: foundUser.last_name,
        type: foundUser.type,
        isAdmin: foundUser.isAdmin,
      };
      const token = Helper.generateToken(userToken);
      response = {
        token,
        id: foundUser.id,
        firstName: foundUser.first_name,
        lastName: foundUser.last_name,
        email: foundUser.email,
        type: foundUser.type,
      };
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }
}

export default UserService;
