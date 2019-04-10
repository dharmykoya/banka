"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var Helper = {
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken: function generateToken(user) {
    var token = _jsonwebtoken.default.sign({
      user: user
    }, process.env.JWT_SECRET, {
      expiresIn: '7h'
    });

    return token;
  },

  /**
   * Error format
   * @param {string} statusCode
   * @returns {string} error format
   */
  errorResponse: function errorResponse(res, statusCode, error) {
    return res.status(statusCode).send({
      status: statusCode,
      error: error
    });
  }
};
var _default = Helper;
exports.default = _default;