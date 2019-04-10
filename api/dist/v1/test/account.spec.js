"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _index = _interopRequireDefault(require("../../index"));

var _account = _interopRequireDefault(require("../services/account.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env mocha */
var expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

describe('The endpoint for Accounts Resource', function () {
  it('should create an account for a user', function (done) {
    _chai.default.request(_index.default).post('/api/v1/accounts').send({
      firstName: 'Damilola',
      lastName: 'Adekoya',
      email: 'dharmykoya38@gmil.com',
      owner: 1,
      type: 'savings',
      status: 'active',
      balance: 1000000
    }).end(function (err, res) {
      expect(res).to.have.status(201);
      expect(res.body.status).to.be.equal(201);
      expect(res.body.data).to.have.key('accountNumber', 'email', 'firstName', 'lastName', 'type', 'openingBalance', 'status');
      done();
    });
  });
  it('should return missing fields, fields failing validation and their messages', function (done) {
    _chai.default.request(_index.default).post('/api/v1/accounts').send({
      firstName: 'Damilola',
      lastName: '',
      email: 'dharmykoya38@gmil.com',
      owner: 1,
      type: 'children-savings',
      status: 'active',
      balance: 1000000
    }).end(function (err, res) {
      expect(res).to.have.status(422);
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be.equal('Please enter your last name');
      done();
    });
  });
  it('should change the status of an account', function (done) {
    _chai.default.request(_index.default).patch('/api/v1/accounts/2000000002').send({
      status: 'active'
    }).end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.body.status).to.be.equal(200);
      expect(res.body.data).to.have.key('accountNumber', 'status');
      done();
    });
  });
  it('should return No account found/Incorrect account number when changing the status of an account with a wrong account number', function (done) {
    _chai.default.request(_index.default).patch('/api/v1/accounts/20000000024544').send({
      status: 'active'
    }).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('No account found/Incorrect account number');
      done();
    });
  });
  it('should return Please select an appropriate status if the status is not a valid status', function (done) {
    _chai.default.request(_index.default).patch('/api/v1/accounts/2000000002').send({
      status: 'wrongstatus'
    }).end(function (err, res) {
      expect(res).to.have.status(422);
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be.equal('Please select an appropriate status');
      done();
    });
  });
  it('should delete a user bank account', function (done) {
    _chai.default.request(_index.default).delete('/api/v1/accounts/2000000001').end(function (err, res) {
      expect(res).to.have.status(202);
      expect(res.body.status).to.be.equal(202);
      expect(res.body.data.message).to.be.equal('Account successfully deleted');
      done();
    });
  });
  it('should return No account found/Incorrect account number', function (done) {
    _chai.default.request(_index.default).delete('/api/v1/accounts/200000000133').end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('No account found/Incorrect account number');
      done();
    });
  });
  it('checkDormantAccount(accountNumber)should return true if account is dormant', function () {
    var checkDormant = _account.default.checkDormantAccount(2000000003);

    expect(checkDormant).to.be.equal(true);
  });
  it('checkDormantAccount(accountNumber)should return false if account is not dormant', function () {
    var checkDormant = _account.default.checkDormantAccount(2000000001);

    expect(checkDormant).to.be.equal(false);
  });
  it('generateAccountNumber()should return a generated account Number', function () {
    var checkDormant = _account.default.generateAccountNumber();

    expect(checkDormant).to.be.a('number');
  });
  it('findAccountByAccountNumber(accountNumber) should return the account Details found', function () {
    var accountDetails = _account.default.findAccountByAccountNumber(2000000000);

    expect(accountDetails).to.have.key('id', 'accountNumber', 'createdOn', 'owner', 'type', 'status', 'balance');
  });
  it('findAccountByAccountNumber(wrongAccountNumber) No account found/Incorrect account number', function () {
    var accountDetails = _account.default.findAccountByAccountNumber(200000000055);

    expect(accountDetails.message).to.be.equal('No account found/Incorrect account number');
  });
});