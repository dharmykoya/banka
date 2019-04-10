/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import TransactionService from '../services/transaction.service';
import app from '../../index';

const { expect } = chai;
const minBalance = 1000;
let staffToken = '';
let clientToken = '';
let newAccountNumber;


chai.use(chaiHttp);


describe('Transaction Resource', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Mercy',
        lastName: 'Fayemi',
        email: 'mercy@gmil.com',
        password: 'bankappclient',
        confirm_password: 'bankappclient',
        type: 'staff',
      })
      .end((err, res) => {
        staffToken = `Bearer ${res.body.data.token}`;
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'type');
        done();
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Tope',
        lastName: 'Fayemi',
        email: 'tope@gmil.com',
        password: 'bankappclient',
        confirm_password: 'bankappclient',
        type: 'client',
      })
      .end((err, res) => {
        clientToken = `Bearer ${res.body.data.token}`;
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'type');
        done();
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'savings',
        status: 'active',
      })
      .set('Authorization', clientToken)
      .end((err, res) => {
        const { accountNumber } = res.body.data;
        newAccountNumber = accountNumber;
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('accountNumber', 'email', 'firstName', 'lastName', 'type', 'openingBalance', 'status');
        done();
      });
  });
  it('should return Auth token is not supplied if header is not set', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/2000000000/debit')
      .send({
        amount: 30000000000,
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Auth token is not supplied');
        done();
      });
  });
  it('should return You do not have the authorization or right to perform this action if header is not set', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/2000000000/debit')
      .send({
        amount: 30000000000,
      })
      .set('Authorization', clientToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('You do not have the authorization or right to perform this action');
        done();
      });
  });
  it('should credit a user account', (done) => {
    chai
      .request(app)
      .post(`/api/v1/transactions/${newAccountNumber}/credit`)
      .send({
        amount: 3000,
      })
      .set('Authorization', staffToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('transactionId', 'accountNumber', 'amount', 'cashier', 'transactionType', 'accountBalance');
        expect(res.body.data.accountNumber).to.be.a('number');
        expect(res.body.data.accountBalance).to.be.a('string');
        done();
      });
  });
  it('should return No account found/Incorrect account number on credit transaction for incorrect account number', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/2000000001234/credit')
      .send({
        amount: 300000,
      })
      .set('Authorization', staffToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('No account found/Incorrect account number');
        done();
      });
  });
  it('should debit a user bank account', (done) => {
    chai
      .request(app)
      .post(`/api/v1/transactions/${newAccountNumber}/debit`)
      .send({
        amount: 3000,
      })
      .set('Authorization', staffToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('transactionId', 'accountNumber', 'amount', 'cashier', 'transactionType', 'accountBalance');
        done();
      });
  });
  it('should return Insufficient Balance.', (done) => {
    chai
      .request(app)
      .post(`/api/v1/transactions/${newAccountNumber}/debit`)
      .send({
        amount: 30000000000,
      })
      .set('Authorization', staffToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Insufficient Balance.');
        done();
      });
  });
  it('should return No account found/Incorrect account number on debit transaction for incorrect account number', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/200000000133/debit')
      .send({
        amount: 30000000000,
      })
      .set('Authorization', staffToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('No account found/Incorrect account number');
        done();
      });
  });
  it(`should return You can not have less than ${minBalance} in your account.`, (done) => {
    chai
      .request(app)
      .post(`/api/v1/transactions/${newAccountNumber}/debit`)
      .send({
        amount: 1800,
      })
      .set('Authorization', staffToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal(`You can not have less than ${minBalance} in your account.`);
        done();
      });
  });
  it('should return Account is dormant. Please reactivate. while doing credit transaction', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/2000000003/credit')
      .send({
        amount: 300000,
      })
      .set('Authorization', staffToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Account is dormant. Please reactivate.');
        done();
      });
  });
  it('should return Account is dormant. Please reactivate. while debitting an account', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/2000000003/debit')
      .send({
        amount: 3000,
      })
      .set('Authorization', staffToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Account is dormant. Please reactivate.');
        done();
      });
  });
  it('transactionAction()should return a debit transaction', () => {
    const transaction = TransactionService.transactionAction('debit', 6, 1, 2000000005, 30000, 70000);
    expect(transaction).to.have.key('transactionId', 'accountNumber', 'amount', 'cashier', 'transactionType', 'accountBalance');
  });
  it('transactionAction()should return a credit transaction', () => {
    const transaction = TransactionService.transactionAction('credit', 6, 1, 2000000005, 30000, 70000);
    expect(transaction).to.have.key('transactionId', 'accountNumber', 'amount', 'cashier', 'transactionType', 'accountBalance');
  });
  it('transactionAction()should return a credit transaction', () => {
    const transaction = TransactionService.transactionAction('debit', 6, 1, 2000000005, 6500, 7000);
    expect(transaction.message).to.be.equal(`You can not have less than ${minBalance} in your account.`);
  });
});
