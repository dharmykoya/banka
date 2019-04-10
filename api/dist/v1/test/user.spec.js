"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _index = _interopRequireDefault(require("../../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env mocha */
var expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

describe('The authentication endpoint test', function () {
  /**
   * test for Signup endpoint
   * to see if the res body is an object
   */
  describe('Signup user endpoint', function () {
    it('should add a new user and return a token', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signup').send({
        email: 'dami@gmail.com',
        firstName: 'damilola',
        lastName: 'Koya',
        password: 'bankappclient',
        confirm_password: 'bankappclient',
        type: 'client'
      }).end(function (err, res) {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'type');
        done();
      });
    });
    it('should return Please enter your first name if the firstName is missing', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signup').send({
        email: 'dami@gmail.com',
        firstName: '',
        lastName: 'Koya',
        password: 'bankappclient',
        confirm_password: 'bankappclient',
        type: 'client'
      }).end(function (err, res) {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be.equal('Please enter your first name');
        done();
      });
    });
    it('should return Please enter your last name if the lastName is missing', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signup').send({
        email: 'taiwo@gmail.com',
        firstName: 'Taiwo',
        lastName: '',
        password: 'bankappclient',
        confirm_password: 'bankappclient',
        type: 'client'
      }).end(function (err, res) {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be.equal('Please enter your last name');
        done();
      });
    });
    it('should return Please enter a valid email if the email is not a type of email', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signup').send({
        email: 'dami.gmail.com',
        firstName: 'Felix',
        lastName: 'Koya',
        password: 'bankappclient',
        confirm_password: 'bankappclient',
        type: 'client'
      }).end(function (err, res) {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be.equal('Please enter a valid email');
        done();
      });
    });
    it('should return Pasword can not be less than 6 characters if no password is provided', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signup').send({
        email: 'tobi@gmail.com',
        firstName: 'Tobi',
        lastName: 'Koya',
        password: 'dami',
        confirm_password: 'dami',
        type: 'client'
      }).end(function (err, res) {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be.equal('Pasword can not be less than 6 characters');
        done();
      });
    });
    it('should return passwords must match if passwords do not match', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signup').send({
        email: 'tobi@gmail.com',
        firstName: 'Tobi',
        lastName: 'Koya',
        password: 'damil',
        confirm_password: 'dami',
        type: 'client'
      }).end(function (err, res) {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error).to.be.equal('passwords must match');
        done();
      });
    });
  });
  /**
   * test for SignIn endpoint
   * to see if the res body is an object
   */

  describe('Signin user endpoint', function () {
    it('should let a user gain access to the app and create a token', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signin').send({
        email: 'doyin@gmail.com',
        password: 'bankappstaff'
      }).end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'password', 'type', 'isAdmin');
        done();
      });
    });
    it('should return No user found/Incorrect email or password', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signin').send({
        email: 'doyhgggfgf@gmail.com',
        password: 'bankappstaff'
      }).end(function (err, res) {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body.error).to.be.equal('No user found/Incorrect email or password');
        done();
      });
    });
    it('should return Please enter a valid mail', function (done) {
      _chai.default.request(_index.default).post('/api/v1/auth/signin').send({
        email: 'doyin.gmail.com',
        password: 'bankappstaff'
      }).end(function (err, res) {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be.equal('Please enter a valid email');
        done();
      });
    });
  });
});