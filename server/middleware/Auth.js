import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Helper from '../services/helper';

dotenv.config();

/**
 *
 *@exports
 * @class Auth
 */
class Auth {
  /**
   *
   * Handles Authorization and checks who is currently logged in
   * if authorization is successful
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} Function next() or an error Object
   * @memberof Auth
   */
  static getUser(req, res, next) {
    let token = req.body.token || req.query.token
        || req.headers['x-access-token'] || req.headers.Authorization
        || req.headers.authorization;
    token = token ? token.substring(7) : token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return Helper.errorResponse(res, 500, err);
        }
        req.decoded = decoded;
        return next();
      });
    } else {
      const error = 'Please login to perform this action';
      return Helper.errorResponse(res, 403, error);
    }
    return false;
  }

  /**
   *
   * Checks if the current user is a staff or not
   * and applies appropriate access control
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {(function|Object)} Function next() or an error Object
   * @memberof Auth
   */
  static staffCheck(req, res, next) {
    const { type, isAdmin } = req.decoded.user;
    if (type === 'staff' && isAdmin === false) {
      return next();
    }
    const error = 'You do not have the authorization or right to perform this action';
    return Helper.errorResponse(res, 401, error);
  }

  /**
   *
   * Checks if the current user is a staff or not
   * and applies appropriate access control
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {(function|Object)} Function next() or an error Object
   * @memberof Auth
   */
  static staffAdminCheck(req, res, next) {
    const { type } = req.decoded.user;
    if (type === 'staff') {
      return next();
    }
    const error = 'You do not have the authorization or right to perform this action';
    return Helper.errorResponse(res, 401, error);
  }

  /**
   *
   * Checks if the current user is a staff or not
   * and applies appropriate access control
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {(function|Object)} Function next() or an error Object
   * @memberof Auth
   */
  static AdminCheck(req, res, next) {
    const { isAdmin } = req.decoded.user;
    if (isAdmin === true) {
      return next();
    }
    const error = 'You do not have the authorization or right to perform this action';
    return Helper.errorResponse(res, 401, error);
  }
}

export default Auth;
