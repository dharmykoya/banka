"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _user = _interopRequireDefault(require("./v1/routes/user.route"));

var _account = _interopRequireDefault(require("./v1/routes/account.route"));

var _transaction = _interopRequireDefault(require("./v1/routes/transaction.route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Routes for the app
require('dotenv').config();

var app = (0, _express.default)();
app.use(_bodyParser.default.json());
app.use((0, _expressValidator.default)());
var PORT = process.env.PORT || 2500;
app.get('/', function (req, res) {
  return res.send({
    status: 200,
    message: 'Welcome to Banka by Damilola Adekoya By Damilola Adekoya'
  });
});
app.use('/api/v1/auth', _user.default);
app.use('/api/v1/accounts', _account.default);
app.use('/api/v1/transactions', _transaction.default);
app.listen(PORT, function () {
  // eslint-disable-next-line no-console
  console.log("server is listening on port:".concat(PORT));
});
var _default = app;
exports.default = _default;