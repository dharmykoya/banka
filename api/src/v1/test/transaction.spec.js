/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import TransactionService from '../services/transaction.service';
import app from '../../index';

const { expect } = chai;
const minBalance = 1000;

chai.use(chaiHttp);


describe('Transaction Resource', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        firstName: 'Toyin',
        lastName: 'Fayemi',
        email: 'toyin@gmil.com',
        owner: 4,
        type: 'savings',
        status: 'dormant',
        balance: 1000000,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.have.key('accountNumber', 'email', 'firstName', 'lastName', 'type', 'openingBalance', 'status');
        done();
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        firstName: 'Peace',
        lastName: 'James',
        email: 'peace@gmil.com',
        owner: 6,
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
  it('should credit a user account', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/2000000000/credit')
      .send({
        amount: 300000,
      })
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
      .post('/api/v1/transactions/2000000000/debit')
      .send({
        amount: 3000,
      })
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
      .post('/api/v1/transactions/2000000000/debit')
      .send({
        amount: 30000000000,
      })
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
      .post('/api/v1/transactions/2000000006/debit')
      .send({
        amount: 999700,
      })
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
      .post('/api/v1/transactions/2000000005/credit')
      .send({
        amount: 300000,
      })
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
      .post('/api/v1/transactions/2000000005/debit')
      .send({
        amount: 30000,
      })
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
});
