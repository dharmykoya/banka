"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _index = _interopRequireDefault(require("../../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env mocha */
var expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

describe('Test for the App entry point', function () {
  it('Should return Welcome message', function () {
    _chai.default.request(_index.default).get('/').end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Welcome to Banka by Damilola Adekoya By Damilola Adekoya');
    });
  });
});