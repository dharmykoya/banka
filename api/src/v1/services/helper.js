import jwt from 'jsonwebtoken';


require('dotenv').config();


const Helper = {
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(user) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '7h' });
    return token;
  },

  /**
   * Error format
   * @param {string} statusCode
   * @returns {string} error format
   */
  errorResponse(res, statusCode, error) {
    return res.status(statusCode).send({
      status: statusCode,
      error,
    });
  },
};

export default Helper;
