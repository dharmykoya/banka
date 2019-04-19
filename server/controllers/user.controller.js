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
}

export default UserController;
