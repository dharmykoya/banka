"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _transaction = _interopRequireDefault(require("../controllers/transaction.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
router.post('/:accountNumber/credit', _transaction.default.creditAccount);
router.post('/:accountNumber/debit', _transaction.default.debitAccount);
var _default = router;
exports.default = _default;