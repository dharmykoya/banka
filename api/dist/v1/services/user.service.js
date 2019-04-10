"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helper = _interopRequireDefault(require("./helper"));

var _user = _interopRequireDefault(require("../data/user"));

var _user2 = _interopRequireDefault(require("../models/user.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class UserService
 * @description handles the request coming from the user controller.
 * @exports UserController
 */
var UserService =
/*#__PURE__*/
function () {
  function UserService() {
    _classCallCheck(this, UserService);
  }

  _createClass(UserService, null, [{
    key: "signUp",

    /**
     * @description Create a User
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof UserService
     */
    value: function signUp(user) {
      var email = user.email,
          firstName = user.firstName,
          lastName = user.lastName,
          password = user.password,
          type = user.type,
          isAdmin = user.isAdmin;
      var usersLength = _user.default.users.length;
      var lastId = _user.default.users[usersLength - 1].id;
      var id = lastId + 1;
      var newUser = new _user2.default(id, email, firstName, lastName, password, type, isAdmin);
      _user.default.users = [].concat(_toConsumableArray(_user.default.users), [newUser]); // generating token

      var token = _helper.default.generateToken(newUser);

      return {
        token: token,
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        type: type
      };
    }
    /**
     * @description User can signin
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} API response
     * @memberof UserService
     */

  }, {
    key: "loginUser",
    value: function loginUser(user) {
      var email = user.email,
          password = user.password;

      var foundUser = _user.default.users.find(function (userDetails) {
        return email === userDetails.email && password === userDetails.password;
      });

      if (!foundUser) {
        var response = {
          error: true,
          message: 'No user found/Incorrect email or password'
        };
        return response;
      } // generating token


      var token = _helper.default.generateToken(foundUser);

      return _objectSpread({
        token: token
      }, foundUser);
    }
  }]);

  return UserService;
}();

var _default = UserService;
exports.default = _default;