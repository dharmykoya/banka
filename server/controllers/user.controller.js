/* eslint-disable max-len */
import UserService from '../services/user.service';

/**
 * @class UserController
 * @description handles the request coming from the user route and interacts with the user service class
 * @exports UserController
 */
class UserController {
  /**
  * @description Create a User
  * @static
  * @param {Object} req
  * @param {Object} res
  * @returns {Object} API response
  * @memberof UserController
  */
  static async signUp(req, res) {
    const user = req.body;
    try {
      const newUser = await UserService.signUp(user);
      if (newUser.error) {
        throw newUser;
      }
      return res.status(201).send({
        status: 201,
        data: newUser,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description User can signin
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof UserController
      */
  static async signIn(req, res) {
    const user = req.body;
    try {
      const foundUser = await UserService.loginUser(user);
      if (foundUser.error) {
        throw foundUser;
      }
      return res.status(200).send({
        status: 200,
        data: foundUser,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description to view all accounts owned by a user
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof UserController
      */
  static async userAccounts(req, res) {
    const { email } = req.params;
    try {
      const userAccounts = await UserService.userAccounts(email);
      if (userAccounts.error) {
        throw userAccounts;
      }
      return res.status(200).send({
        status: 200,
        data: userAccounts,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
  * @description to allow a user upload a picture
  * @static
  * @param {Object} req
  * @param {Object} res
  * @returns {Object} API response
  * @memberof UserController
  */
  static async uploadPicture(req, res) {
    const { id } = req.decoded.user;
    const { url } = req.image;
    try {
      if (url === undefined) {
        const response = 'Please select a file to upload';
        return response;
      }
      const uploadedPic = await UserService.uploadPicture(url, id);
      if (uploadedPic.error) {
        throw uploadedPic;
      }
      return res.status(200).send({
        status: 200,
        data: uploadedPic,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
  * @description Create a User
  * @static
  * @param {Object} req
  * @param {Object} res
  * @returns {Object} API response
  * @memberof UserController
  */
  static async createStaff(req, res) {
    const user = req.body;
    try {
      const newUser = await UserService.createStaff(user);
      if (newUser.error) {
        throw newUser;
      }
      return res.status(201).send({
        status: 201,
        data: newUser,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description to view all accounts owned by a user
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof UserController
      */
  static async userAccountsById(req, res) {
    const paramUserId = req.params.userId;
    const { user } = req.decoded;
    try {
      const userAccounts = await UserService.userAccountsById(paramUserId, user);
      if (userAccounts.error) {
        throw userAccounts;
      }
      return res.status(200).send({
        status: 200,
        data: userAccounts,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description to view all staff in the app
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof UserController
      */
  static async allStaff(req, res) {
    try {
      const userAccounts = await UserService.allStaff();
      if (userAccounts.error) {
        throw userAccounts;
      }
      return res.status(200).send({
        status: 200,
        data: userAccounts,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }

  /**
      * @description to view all accounts owned by a user
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof UserController
      */
  static async userById(req, res) {
    const paramUserId = req.params.userId;
    try {
      const user = await UserService.findUserById(paramUserId);
      if (user.error) {
        throw user;
      }
      delete user.password;
      delete user.updated_at;
      return res.status(200).send({
        status: 200,
        data: user,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.message,
      });
    }
  }

  /**
      * @description to view all accounts owned by a user
      * @static
      * @param {Object} req
      * @param {Object} res
      * @returns {Object} API response
      * @memberof UserController
      */
  static async updatePassword(req, res) {
    const userId = req.decoded.user.id;
    const { oldPassword, password } = req.body;
    try {
      const user = await UserService.updatePassword(oldPassword, password, userId);
      if (user.error) {
        throw user;
      }
      delete user.password;
      delete user.updated_at;
      return res.status(200).send({
        status: 200,
        data: user,
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err.err,
      });
    }
  }
}

export default UserController;
