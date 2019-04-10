"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _user = _interopRequireDefault(require("../services/user.service"));

var _helper = _interopRequireDefault(require("../services/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class UserController
 * @description handles the request coming from the user route and interacts with the user service class
 * @exports UserController
 */
var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: "signUp",

    /**
        * @description Create a User
        * @static
        * @param {Object} req
        * @param {Object} res
        * @returns {Object} API response
        * @memberof UserController
        */
    value: function signUp(req, res) {
      var user = req.body;

      var newUser = _user.default.signUp(user);

      return res.status(201).send({
        status: 201,
        data: newUser
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

  }, {
    key: "signIn",
    value: function signIn(req, res) {
      var user = req.body;

      var newUser = _user.default.loginUser(user);

      if (newUser.error) {
        // return res.status(401).send({
        //   status: 401,
        //   error: newUser.message,
        // });
        return _helper.default.errorResponse(res, 401, newUser.message);
      }

      return res.status(200).send({
        status: 200,
        data: newUser
      });
    }
  }]);

  return UserController;
}();

var _default = UserController;
exports.default = _default;