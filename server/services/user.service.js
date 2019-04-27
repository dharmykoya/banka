/* eslint-disable max-len */
import Helper from './helper';
import Model from '../models/Model';
import Mail from './mail';

/**
 * @class UserService
 * @description handles the request coming from the user controller.
 * @exports UserController
 */
class UserService {
  /**
   * @description find a user by id
   * @static
   * @param {Integer} id
   * @returns {Object} API response
   * @memberof UserService
   */
  static async findUserById(id) {
    const column = 'id';
    const model = new Model('users');
    const foundUser = await model.FindOne(column, id);
    // checks if the account does not exist
    if (!foundUser || foundUser.name === 'error') {
      const response = { error: true, message: 'No user found' };
      return response;
    }
    return foundUser;
  }

  /**
   * @description find user by email
   * @static
   * @param {Object} email
   * @returns {Object} API response
   * @memberof UserService
   */
  static async findUserByEmail(email) {
    const model = new Model('users');
    const foundUser = await model.FindOne('email', email);
    // checks if the account does not exist
    if (!foundUser) {
      const response = { error: true, message: 'No account found/Incorrect account number' };
      return response;
    }
    return foundUser;
  }

  /**
   * @description Create a User
   * @static
   * @param {Object} user
   * @returns {Object} API response
   * @memberof UserService
   */
  static async signUp(user) {
    const {
      email, firstName, lastName, password,
    } = user;
    try {
      const type = 'client';
      const hashPassword = Helper.hashPassword(password);
      const model = new Model('users');
      const newUser = await model
        .Insert(email.toLowerCase(), firstName.toLowerCase(),
          lastName.toLowerCase(), hashPassword, type);
      if (newUser.name === 'error' || newUser === undefined) {
        const response = 'you have been registered earlier, please login';
        throw response;
      }
      const userToken = { ...Helper.tokenReturn(newUser) };
      // generating token
      const token = Helper.generateToken(userToken);
      const res = { token, ...Helper.userReturn(newUser) };
      const payload = Helper.newUserPayload(email, firstName, lastName);
      await Mail.sendMail(payload);
      return res;
    } catch (err) {
      const response = { error: true, err };
      return response;
    }
  }

  /**
   * @description User can signin
   * @static
   * @param {Object} user
   * @returns {Object} API response
   * @memberof UserService
   */
  static async loginUser(user) {
    let response;
    const { email, password } = user;
    try {
      const column = 'email';
      const model = new Model('users');
      const foundUser = await model.FindOne(column, email);
      if (!foundUser) {
        response = 'Email is not registered on this app. Please signup.';
        throw response;
      }
      const hashPassword = Helper.comparePassword(password, foundUser.password);
      if (!hashPassword) {
        response = 'Authentication failed.Email/Wrong password.';
        throw response;
      }
      const userToken = { ...Helper.tokenReturn(foundUser) };
      const token = Helper.generateToken(userToken);
      return { token, ...Helper.userReturn(foundUser) };
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description to veiw all accounts owned by a user
   * @static
   * @param {Object} email
   * @returns {Object} returns all acounts owned by a user
   * @memberof UserService
   */
  static async userAccounts(email) {
    let response;
    try {
      const user = await this.findUserByEmail(email);
      if (user.error) {
        response = 'no user found';
        throw response;
      }

      const { id } = user;
      const column = 'owner';
      const model = new Model('accounts');
      const userAccounts = await model.Find(column, id);
      if (userAccounts.length === 0 || userAccounts.name === 'error') {
        response = `user ${email} has no accounts`;
        throw response;
      }
      return userAccounts;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description to veiw all accounts owned by a user
   * @static
   * @param {Object} path
   * @param {Object} id
   * @returns {Object} returns all acounts owned by a user
   * @memberof UserService
   */
  static async uploadPicture(path, id) {
    let response;
    try {
      const model = new Model('users');
      const uploadedPicture = await model.Update('profile_image', 'id', path, id);
      if (uploadedPicture === undefined || uploadedPicture.name === 'error') {
        response = 'upload failed';
        throw response;
      }
      response = 'file uploaded successfully';
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description Create a User
   * @static
   * @param {Object} user
   * @returns {Object} API response
   * @memberof UserService
   */
  static async createStaff(user) {
    const {
      email, firstName, lastName, password,
    } = user;
    try {
      const type = 'staff';
      const hashPassword = Helper.hashPassword(password);
      const model = new Model('users');
      const newUser = await model
        .Insert(email.toLowerCase(), firstName.toLowerCase(),
          lastName.toLowerCase(), hashPassword, type);
      if (newUser.name === 'error' || newUser === undefined) {
        const response = 'you have been registered earlier, please login';
        throw response;
      }
      const userToken = { ...Helper.tokenReturn(newUser) };
      // generating token
      const token = Helper.generateToken(userToken);
      const res = { token, ...Helper.userReturn(newUser) };
      return res;
    } catch (err) {
      const response = { error: true, err };
      return response;
    }
  }
}

export default UserService;
