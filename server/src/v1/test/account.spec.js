/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import AccountService from '../services/account.service';

const { expect } = chai;

chai.use(chaiHttp);
let clientToken = '';
let adminToken = '';

describe('The endpoint for Accounts Resource', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Dotun',
        lastName: 'Fayemi',
        email: 'dotun@gmil.com',
        password: 'Bankappclient1!',
        confirm_password: 'Bankappclient1!',
        type: 'client',
      })
      .end((err, res) => {
        clientToken = `Bearer ${res.body.data.token}`;
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'type');
        expect(res.body.data.id).to.be.equal(4);
        expect(res.body.data.email).to.be.equal('dotun@gmil.com');
        expect(res.body.data.firstName).to.be.equal('Dotun');
        expect(res.body.data.lastName).to.be.equal('Fayemi');
        expect(res.body.data.type).to.be.equal('client');
        done();
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Joy',
        lastName: 'Fayemi',
        email: 'joy@gmil.com',
        password: 'Bankappclient1!',
        confirm_password: 'Bankappclient1!',
        type: 'admin',
      })
      .end((err, res) => {
        adminToken = `Bearer ${res.body.data.token}`;
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'type');
        expect(res.body.data.id).to.be.equal(5);
        expect(res.body.data.email).to.be.equal('joy@gmil.com');
        expect(res.body.data.firstName).to.be.equal('Joy');
        expect(res.body.data.lastName).to.be.equal('Fayemi');
        expect(res.body.data.type).to.be.equal('admin');

        done();
      });
  });
  it('should return Auth token is not supplied if header is not set', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'savings',
        status: 'active',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Auth token is not supplied');
        done();
      });
  });
  it('should return Please select an appropriate account type if an account type is not selected', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: '',
        status: 'active',
      })
      .set('Authorization', clientToken)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be.equal('Please select an appropriate account type');

        done();
      });
  });
  it('should create an account for a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'savings',
        status: 'active',
      })
      .set('Authorization', clientToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('accountNumber', 'email', 'firstName', 'lastName', 'type', 'openingBalance', 'status');
        expect(res.body.data.accountNumber).to.be.equal(2000000004);
        expect(res.body.data.email).to.be.equal('dotun@gmil.com');
        expect(res.body.data.firstName).to.be.equal('Dotun');
        expect(res.body.data.lastName).to.be.equal('Fayemi');
        expect(res.body.data.type).to.be.equal('savings');
        expect(res.body.data.openingBalance).to.be.equal(2000);
        expect(res.body.data.status).to.be.equal('active');
        done();
      });
  });
  it('should return You do not have the authorization or right to perform this action if the client hit the change status end point', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accounts/2000000000')
      .send({
        status: 'dormant',
      })
      .set('Authorization', clientToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body.error).to.be.equal('You do not have the authorization or right to perform this action');
        done();
      });
  });
  it('should change the status of an account', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accounts/2000000002')
      .send({
        status: 'active',
      })
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.have.key('accountNumber', 'status');
        expect(res.body.data.accountNumber).to.be.equal(2000000002);
        expect(res.body.data.status).to.be.equal('active');
        done();
      });
  });

  it('should return No account found/Incorrect account number when changing the status of an account with a wrong account number', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accounts/20000000024544')
      .send({
        status: 'active',
      })
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('No account found/Incorrect account number');
        done();
      });
  });

  it('should return Please select an appropriate status if the status is not a valid status', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accounts/2000000002')
      .send({
        status: 'wrongstatus',
      })
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be.equal('Please select an appropriate status');

        done();
      });
  });

  it('should delete a user bank account', (done) => {
    chai
      .request(app)
      .delete('/api/v1/accounts/2000000001')
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(202);
        expect(res.body.status).to.be.equal(202);
        expect(res.body.data.message).to.be.equal('Account successfully deleted');

        done();
      });
  });

  it('should return No account found/Incorrect account number', (done) => {
    chai
      .request(app)
      .delete('/api/v1/accounts/200000000133')
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('No account found/Incorrect account number');
        done();
      });
  });

  it('checkDormantAccount(accountNumber)should return true if account is dormant', () => {
    const checkDormant = AccountService.checkDormantAccount(2000000003);
    expect(checkDormant).to.be.equal(true);
  });

  it('checkDormantAccount(accountNumber)should return false if account is not dormant', () => {
    const checkDormant = AccountService.checkDormantAccount(2000000001);
    expect(checkDormant).to.be.equal(false);
  });

  it('generateAccountNumber()should return a generated account Number', () => {
    const checkDormant = AccountService.generateAccountNumber();
    expect(checkDormant).to.be.a('number');
  });

  it('findAccountByAccountNumber(accountNumber) should return the account Details found', () => {
    const accountDetails = AccountService.findAccountByAccountNumber(2000000000);
    expect(accountDetails).to.have.key('id', 'accountNumber', 'createdOn', 'owner', 'type', 'status', 'balance');
  });

  it('findAccountByAccountNumber(wrongAccountNumber) No account found/Incorrect account number', () => {
    const accountDetails = AccountService.findAccountByAccountNumber(200000000055);
    expect(accountDetails.message).to.be.equal('No account found/Incorrect account number');
  });
});
