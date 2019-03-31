/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import config from '../config/configuration';


/**
   * @description - check token to allow access only to authenticated users only.
   *
   * @param {object} req
   * @param {object} res
   * @param {object} next - moves the request ti the next action
   * @returns {object} deocded token
   */
const AUTH = {};
AUTH.checkToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.Authorization || req.headers.authorization;
  token = token ? token.substring(7) : token;

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          status: false,
          message: 'Token is not valid',
          err,
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).send({
      status: false,
      message: 'Auth token is not supplied',
    });
  }
};

export default AUTH;
