/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import AccountService from '../services/account.service';

const { expect } = chai;

chai.use(chaiHttp);

describe('The endpoint for Accounts Resource', () => {
  it('should create an account for a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        firstName: 'Damilola',
        lastName: 'Adekoya',
        email: 'dharmykoya38@gmil.com',
        owner: 1,
        type: 'savings',
        status: 'active',
        balance: 1000000,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('accountNumber', 'email', 'firstName', 'lastName', 'type', 'openingBalance', 'status');
        done();
      });
  });

  it('should return missing fields, fields failing validation and their messages', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        firstName: 'Damilola',
        lastName: '',
        email: 'dharmykoya38@gmil.com',
        owner: 1,
        type: 'children-savings',
        status: 'active',
        balance: 1000000,
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be.equal('Please enter your last name');

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
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.have.key('accountNumber', 'status');
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
