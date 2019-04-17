/* eslint-disable max-len */
import Helper from './helper';
import UserData from '../data/user';
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
  // static signUp(user) {
  //   const {
  //     email, firstName, lastName, password, type, isAdmin,
  //   } = user;
  //   const usersLength = UserData.users.length;
  //   const lastId = UserData.users[usersLength - 1].id;
  //   const id = lastId + 1;
  //   const newUser = new User(id, email, firstName, lastName, password, type, isAdmin);
  //   UserData.users = [...UserData.users, newUser];
  //   // generating token
  //   const token = Helper.generateToken(newUser);
  //   return {
  //     token,
  //     id,
  //     email,
  //     firstName,
  //     lastName,
  //     type,
  //   };
  // }
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
  static loginUser(user) {
    const { email, password } = user;
    const foundUser = UserData.users.find(userDetails => email === userDetails.email && password === userDetails.password);
    if (!foundUser) {
      const response = { error: true, message: 'No user found/Incorrect email or password' };
      return response;
    }
    // generating token
    const token = Helper.generateToken(foundUser);
    return { token, ...foundUser };
  }
}

export default UserService;
