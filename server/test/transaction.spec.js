/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Mail from '../services/mail';
import TransactionService from '../services/transaction.service';
import app from '../index';
import Helper from '../services/helper';

const { expect } = chai;
const minBalance = 1000;
let staffToken = '';
let clientToken = '';
let isAdminToken = '';
let newAccountNumber;


chai.use(chaiHttp);


describe('Transaction Resource', () => {
  it('Login an Admin', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'dharmykoya38@gmail.com',
        password: 'BankappClient132@',
      });
    isAdminToken = `Bearer ${res.body.data.token}`;
    expect(res).to.have.status(200);
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data).to.have.key('id', 'token', 'email',
      'firstName', 'lastName', 'type', 'isAdmin');
    expect(res.body.data.email).to.be.equal('dharmykoya38@gmail.com');
    expect(res.body.data.firstName).to.be.equal('Damilola');
    expect(res.body.data.lastName).to.be.equal('Adekoya');
    expect(res.body.data.type).to.be.equal('staff');
  });
  it('signup a staff', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/addstaff')
      .set('Authorization', isAdminToken)
      .send({
        firstName: 'Mercy',
        lastName: 'Fayemi',
        email: 'mercy@gmil.com',
        password: 'Bankappclient2@',
        confirm_password: 'Bankappclient2@',
        type: 'staff',
      });
    staffToken = `Bearer ${res.body.data.token}`;
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have
      .key('id', 'token', 'email', 'firstName', 'lastName', 'type', 'isAdmin');
    expect(res.body.data.email).to.be.equal('mercy@gmil.com');
    expect(res.body.data.firstName).to.be.equal('Mercy');
    expect(res.body.data.lastName).to.be.equal('Fayemi');
    expect(res.body.data.type).to.be.equal('staff');
  });
  it('signup a client', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Tope',
        lastName: 'Fayemi',
        email: 'tope@gmil.com',
        password: 'Bankappclient2@',
        confirm_password: 'Bankappclient2@',
        type: 'client',
      });
    clientToken = `Bearer ${res.body.data.token}`;
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have
      .key('id', 'token', 'email', 'firstName', 'lastName', 'type', 'isAdmin');
    expect(res.body.data.email).to.be.equal('tope@gmil.com');
    expect(res.body.data.firstName).to.be.equal('Tope');
    expect(res.body.data.lastName).to.be.equal('Fayemi');
    expect(res.body.data.type).to.be.equal('client');
  });
  it('create a savings account', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accounts')
      .set('Authorization', clientToken)
      .send({
        type: 'savings',
        status: 'active',
      });
    const { accountNumber } = res.body.data;
    newAccountNumber = accountNumber;
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have
      .key('accountNumber', 'email', 'firstName', 'lastName',
        'type', 'openingBalance', 'status');
    expect(res.body.data.email).to.be.equal('tope@gmil.com');
    expect(res.body.data.firstName).to.be.equal('Tope');
    expect(res.body.data.lastName).to.be.equal('Fayemi');
    expect(res.body.data.type).to.be.equal('savings');
  });
  it('should return Auth token is not supplied if header is not set',
    async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/transactions/2000000000/debit')
        .send({
          amount: 30000000000,
        });
      expect(res.body.status).to.be.equal(403);
      expect(res.body.error).to.be.equal('Auth token is not supplied');
    });
  it(`should return You do not have the authorization or right to perform
  this action if client try to debit an account`, async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/transactions/2000000000/debit')
      .set('Authorization', clientToken)
      .send({
        amount: 30000000000,
      });
    expect(res.body.status).to.be.equal(401);
    expect(res.body.error).to.be
      .equal('You do not have the authorization or right to perform this action');
  });
  it('should return Please input an appropriate number', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/transactions/2000000000/debit')
      .set('Authorization', clientToken)
      .send({
        amount: -20000,
      });
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error).to.be
      .equal('Please input an appropriate number');
  });
  it('should return Please input an appropriate number', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/transactions/2000000000/debit')
      .set('Authorization', clientToken)
      .send({
        amount: 'dami',
      });
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error[0]).to.be
      .equal('Please input a number');
  });
  it('should credit a user account', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${newAccountNumber}/credit`)
      .set('Authorization', staffToken)
      .send({
        amount: 3000,
      });
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have
      .key('transactionId', 'accountNumber', 'amount', 'cashier',
        'transactionType', 'accountBalance');
    expect(res.body.data.accountNumber).to.be.equal(newAccountNumber);
    expect(res.body.data.accountBalance).to.be.equal('5000');
    expect(res.body.data.amount).to.be.equal('3000.00');
    expect(res.body.data.cashier).to.be.equal(6);
    expect(res.body.data.transactionType).to.be.equal('credit');
    expect(res.body.data.transactionId).to.be.equal(5);
  });
  it(`should return No account found/Incorrect account number on credit
  transaction for incorrect account number`, async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/transactions/200001234/credit')
      .set('Authorization', staffToken)
      .send({
        amount: 300000,
      });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be
      .equal('No account found/Incorrect account number');
  });
  it('should debit a user bank account', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${newAccountNumber}/debit`)
      .set('Authorization', staffToken)
      .send({
        amount: 3000,
      });
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have
      .key('transactionId', 'accountNumber', 'amount', 'cashier',
        'transactionType', 'accountBalance');
    expect(res.body.data.accountNumber).to.be.equal(2000000004);
    expect(res.body.data.accountBalance).to.be.equal('2000');
    expect(res.body.data.amount).to.be.equal('3000.00');
    expect(res.body.data.cashier).to.be.equal(6);
    expect(res.body.data.transactionType).to.be.equal('debit');
    expect(res.body.data.transactionId).to.be.equal(6);
  });
  it('should return Insufficient Balance.', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${newAccountNumber}/debit`)
      .set('Authorization', staffToken)
      .send({
        amount: 30000000000,
      });
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be.equal('Insufficient Balance.');
  });
  it(`should return No account found/Incorrect account number on
  debit transaction for incorrect account number`, async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/transactions/20000133/debit')
      .set('Authorization', staffToken)
      .send({
        amount: 30000000000,
      });
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be
      .equal('No account found/Incorrect account number');
  });
  it(`should return You can not have less than ${minBalance} in your account.`,
    async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/transactions/${newAccountNumber}/debit`)
        .set('Authorization', staffToken)
        .send({
          amount: 1800,
        });
      expect(res).to.have.status(400);
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be
        .equal(`You can not have less than ${minBalance} in your account.`);
    });
  it(`should return Account is dormant. Please reactivate.
  while doing credit transaction`, async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/transactions/2000000000/credit')
      .set('Authorization', staffToken)
      .send({
        amount: 300000,
      });
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be
      .equal('Account is dormant. Please reactivate.');
  });
  it(`should return Account is dormant. Please reactivate.
  while debitting an account`, async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/transactions/2000000000/debit')
      .set('Authorization', staffToken)
      .send({
        amount: 3000,
      });
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be
      .equal('Account is dormant. Please reactivate.');
  });
  it('should return a specific transaction', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/transactions/2')
      .set('Authorization', staffToken)
      .send({
        amount: 3000,
      });
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have
      .key('id', 'account_number', 'amount', 'cashier', 'type',
        'old_balance', 'new_balance', 'created_on');
    expect(res.body.data.account_number).to.be.equal(2000000000);
    expect(res.body.data.new_balance).to.be.equal('4000.00');
    expect(res.body.data.old_balance).to.be.equal('7000.00');
    expect(res.body.data.amount).to.be.equal('3000.00');
    expect(res.body.data.cashier).to.be.equal(2);
    expect(res.body.data.type).to.be.equal('debit');
    expect(res.body.data.id).to.be.equal(2);
  });

  it('should return you are not authorized to view this transaction',
    async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/transactions/1')
        .set('Authorization', clientToken)
        .send({
          amount: 3000,
        });
      expect(res.body.status).to.be.equal(400);
      expect(res.body).to.have.key('status', 'error');
      expect(res.body.error).to.be
        .equal('You are not Authorized to view this transaction');
    });
  it('should return invalid transaction details', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/transactions/damilola')
      .set('Authorization', clientToken)
      .send({
        amount: 3000,
      });
    expect(res.body.status).to.be.equal(400);
    expect(res.body).to.have.key('status', 'error');
    expect(res.body.error).to.be.equal('Invalid transaction detail provided');
  });
  it('transactionAction()should return a debit transaction', async () => {
    const transaction = await TransactionService
      .transactionAction('debit', 2, 2000000015, 3000, 7000);
    expect(transaction).to.have
      .key('transactionId', 'accountNumber', 'amount', 'cashier',
        'transactionType', 'accountBalance');
    expect(transaction.accountNumber).to.be.equal(2000000015);
    expect(transaction.accountBalance).to.be.equal('4000');
    expect(transaction.amount).to.be.equal('3000.00');
    expect(transaction.cashier).to.be.equal(2);
    expect(transaction.transactionType).to.be.equal('debit');
    expect(transaction.transactionId).to.be.equal(7);
  });

  it('transactionAction()should return a credit transaction', async () => {
    const transaction = await TransactionService
      .transactionAction('debit', 2, 2000000015, 3000, 7000);
    expect(transaction).to.have
      .key('transactionId', 'accountNumber', 'amount', 'cashier',
        'transactionType', 'accountBalance');
    expect(transaction.accountNumber).to.be.equal(2000000015);
    expect(transaction.accountBalance).to.be.equal('4000');
    expect(transaction.amount).to.be.equal('3000.00');
    expect(transaction.cashier).to.be.equal(2);
    expect(transaction.transactionType).to.be.equal('debit');
    expect(transaction.transactionId).to.be.equal(8);
  });
  it('transactionAction()should return a credit transaction', async () => {
    const transaction = await TransactionService
      .transactionAction('debit', 2, 2000000005, 6500, 7000);
    expect(transaction.err).to.be
      .equal(`You can not have less than ${minBalance} in your account.`);
  });
  it('transactionAction()should return error for a single transaction',
    async () => {
      const transactionId = 'two';
      const singleTransaction = await TransactionService
        .getTransaction(transactionId);
      expect(singleTransaction.err).to.be
        .equal('invalid transaction detail provided');
    });
  it(`creditAccount(userAccountNumber, tranAmount, cashier)
  return error for a credit transaction`, async () => {
    const cashier = 'two';
    const tranAmount = 2000;
    const userAccountNumber = 2000000000;
    const singleTransaction = await TransactionService
      .creditAccount(userAccountNumber, tranAmount, cashier);
    expect(singleTransaction.err).to.be
      .equal('Account is dormant. Please reactivate.');
  });
  it('sendMail(payload) return error for a credit transaction', async () => {
    const payload = Helper.newUserPayload();
    const sendMail = await Mail.sendMail(payload);
    expect(sendMail).to.be.equal('mail failed to send');
  });

  it('sendMail(payload) return payload tansaction for mail', async () => {
    const user = {
      first_name: 'dami',
      last_name: 'koya',
      email: 'dami@gmail.com',
    };
    const newTransaction = {
      amount: 2999,
      new_balance: 13000,
      type: 'credit',
    };
    const payload = Helper.transactionPayload(user, newTransaction);
    expect(payload.email).to.be.equal('dami@gmail.com');
    expect(payload.subject).to.be.equal('credit Transaction from Banka');
    expect(payload.firstName).to.be.equal('dami');
    expect(payload.lastName).to.be.equal('koya');
  });
});
