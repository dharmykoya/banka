import UserData from '../data/user';
import User from '../models/user.model';

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
  static getUsers() {
    
  }

  /**
   * @description Create a User
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof UserService
   */
  // static signUp(user) {
  //   const usersLength = UserData.users.length;
  //   const lastId = UserData.users[usersLength - 1].id;
  //   const id = lastId + 1;
  //   const newUser = { id, ...user };
  //   const Users = [...UserData.users, newUser];
  //   return Users;
  // }
  static signUp(user) {
    const { email, firstName, lastName, password, type, isAdmin } = user;
    const usersLength = UserData.users.length;
    const lastId = UserData.users[usersLength - 1].id;
    const id = lastId + 1;
    const newUser =  new User(id, email, firstName, lastName, password, type, isAdmin);
    const Users = [...UserData.users, newUser];
    return Users;
  }

  /**
   * @description User can signin
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} API response
   * @memberof UserService
   */
  static signIn(user) {
    const { email, password } = user;
  }
}

export default UserService;
