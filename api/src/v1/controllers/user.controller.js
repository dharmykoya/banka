/* eslint-disable max-len */
import { validationResult } from 'express-validator/check';
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
  static signUp(req, res) {
    const user = req.body;
    const newUser = UserService.signUp(user);
    if (newUser.error) {
      return res.status(400).send({
        status: 400,
        error: newUser.message,
      });
    }
    return res.status(201).send({
      status: 201,
      data: newUser,
    });
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
      return res.status(201).send({
        status: 401,
        error: newUser.message,
      });
    }
    return res.status(200).send({
      status: 200,
      data: newUser,
    });
  }
}

export default UserController;
