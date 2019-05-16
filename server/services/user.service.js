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
        const response = 'Email exist already, please login to conitnue';
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
      const userDetails = Helper.userReturn(user);
      response = { userDetails, ...userAccounts };
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }

  /**
   * @description to veiw all accounts owned by a user
   * @static
   * @param {Object} paramUserId
   * @param {Integer} user
   * @returns {Object} returns all acounts owned by a user
   * @memberof UserService
   */
  static async userAccountsById(paramUserId, user) {
    let response;
    try {
      const {
        id, firstName, lastName, type,
      } = user;
      const column = 'owner';
      const model = new Model('accounts');
      if (type === 'client' && id !== parseInt(paramUserId, Number)) {
        response = 'You are not authorized to view another account';
        throw response;
      }
      if (type === 'client' && id === parseInt(paramUserId, Number)) {
        const userAccounts = await model.Find(column, paramUserId);
        if (userAccounts.length === 0 || userAccounts.name === 'error') {
          response = `user ${firstName} ${lastName} has no accounts`;
          throw response;
        }
        response = { user, ...userAccounts };
        return response;
      }

      // finds the user, the admin or staff is trying to get all their account details
      const userDetails = await this.findUserById(paramUserId);
      if (userDetails.error) {
        response = 'no user found';
        throw response;
      }
      const userAccounts = await model.Find(column, paramUserId);
      if (userAccounts.length === 0 || userAccounts.name === 'error') {
        response = `user ${userDetails.first_name} ${userDetails.last_name} has no accounts`;
        throw response;
      }
      const formatDetail = Helper.userReturn(userDetails);
      response = { formatDetail, ...userAccounts };
      return response;
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

  /**
   * @description returns all the staff in the app
   * @static
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async allStaff() {
    const model = new Model('users');
    const allStaff = await model.FindAllStaff();
    const response = allStaff;
    return response;
  }

  /**
   * @description update a user password
   * @static
   * @param {Object} oldPassword
   * @param {Object} newPassword
   * @param {Object} userId
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async updatePassword(oldPassword, newPassword, userId) {
    let response;
    try {
      const model = new Model('users');
      const user = await this.findUserById(userId);
      const { password } = user;
      const hashPassword = Helper.comparePassword(oldPassword, password);
      if (!hashPassword) {
        response = 'Please enter your old password';
        throw response;
      }
      const newHashPassword = Helper.hashPassword(newPassword);
      await model.Update('password', 'id', newHashPassword, userId);

      response = 'password changed successfully';
      return response;
    } catch (err) {
      response = { error: true, err };
      return response;
    }
  }
}

export default UserService;
