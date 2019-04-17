/* eslint-disable max-len */
import UserService from '../services/user.service';
import Helper from '../services/helper';

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
  static signIn(req, res) {
    const user = req.body;
    const newUser = UserService.loginUser(user);
    if (newUser.error) {
      return Helper.errorResponse(res, 401, newUser.message);
    }
    return res.status(200).send({
      status: 200,
      data: newUser,
    });
  }
}

export default UserController;
