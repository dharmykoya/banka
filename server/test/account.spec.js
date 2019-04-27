/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import AccountService from '../services/account.service';

const { expect } = chai;

chai.use(chaiHttp);
let clientToken = '';
let adminToken = '';
let isAdminToken = '';


describe('The endpoint for Accounts Resource', () => {
  it('register a client', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Victor',
        lastName: 'Fayemi',
        email: 'victor@gmil.com',
        password: 'Bankappclient1!',
        confirm_password: 'Bankappclient1!',
        type: 'client',
      });
    clientToken = `Bearer ${res.body.data.token}`;
    expect(res).to.have.status(201);
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have.key('id', 'token', 'email',
      'firstName', 'lastName', 'type', 'isAdmin');
    expect(res.body.data.email).to.be.equal('victor@gmil.com');
    expect(res.body.data.firstName).to.be.equal('Victor');
    expect(res.body.data.lastName).to.be.equal('Fayemi');
    expect(res.body.data.type).to.be.equal('client');
  });
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
  it('register a staff', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/addstaff')
      .set('Authorization', isAdminToken)
      .send({
        firstName: 'Peace',
        lastName: 'Fayemi',
        email: 'peace@gmil.com',
        password: 'Bankappclient1!',
        confirm_password: 'Bankappclient1!',
      });
    adminToken = `Bearer ${res.body.data.token}`;
    expect(res).to.have.status(201);
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have.key('id', 'token', 'email',
      'firstName', 'lastName', 'type', 'isAdmin');
    expect(res.body.data.email).to.be.equal('peace@gmil.com');
    expect(res.body.data.firstName).to.be.equal('Peace');
    expect(res.body.data.lastName).to.be.equal('Fayemi');
    expect(res.body.data.type).to.be.equal('staff');
  });
  it('create a current account', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accounts')
      .set('Authorization', clientToken)
      .send({
        type: 'current',
        status: 'active',
      });
    expect(res).to.have.status(201);
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have.key('accountNumber', 'email',
      'firstName', 'lastName', 'type', 'openingBalance', 'status');
    expect(res.body.data.accountNumber).to.be.equal(2000000002);
    expect(res.body.data.email).to.be.equal('victor@gmil.com');
    expect(res.body.data.firstName).to.be.equal('Victor');
    expect(res.body.data.lastName).to.be.equal('Fayemi');
    expect(res.body.data.type).to.be.equal('current');
    expect(res.body.data.openingBalance).to.be.equal(2000);
    expect(res.body.data.status).to.be.equal('active');
  });
  it('should return Auth token is not supplied if header is not set',
    async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/accounts')
        .send({
          type: 'savings',
          status: 'active',
        });
      expect(res).to.have.status(403);
      expect(res.body.status).to.be.equal(403);
      expect(res.body.error).to.be.equal('Please login to perform this action');
    });
  it(`should return Please select an appropriate account 
    type if an account type is not selected`,
  async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accounts')
      .set('Authorization', clientToken)
      .send({
        type: '',
        status: 'active',
      });
    expect(res).to.have.status(422);
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error[0]).to.be
      .equal('Type cannot be empty');
  });
  it(`should return Please select an appropriate account 
    type if an account type is not selected`,
  async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accounts')
      .set('Authorization', clientToken)
      .send({
        type: 'saved',
        status: 'active',
      });
    expect(res).to.have.status(422);
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error[0]).to.be
      .equal('Please select an appropriate account type');
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
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have.key('accountNumber', 'email',
      'firstName', 'lastName', 'type', 'openingBalance', 'status');
    expect(res.body.data.accountNumber).to.be.equal(2000000003);
    expect(res.body.data.email).to.be.equal('victor@gmil.com');
    expect(res.body.data.firstName).to.be.equal('Victor');
    expect(res.body.data.lastName).to.be.equal('Fayemi');
    expect(res.body.data.type).to.be.equal('savings');
    expect(res.body.data.openingBalance).to.be.equal(2000);
    expect(res.body.data.status).to.be.equal('active');
  });

  it(`should return You do not have the authorization or right to perform 
this action if the client hit the change status end point`, async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/accounts/2000000000')
      .set('Authorization', clientToken)
      .send({
        status: 'dormant',
      });
    expect(res.body.status).to.be.equal(401);
    expect(res.body.error).to.be
      .equal('You do not have the authorization or right to perform this action');
  });
  it('should change the status of an account', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/accounts/2000000001')
      .set('Authorization', adminToken)
      .send({
        status: 'dormant',
      });

    expect(res.body.status).to.be.equal(200);
    expect(res.body.data).to.have.key('accountNumber', 'status');
    expect(res.body.data.accountNumber).to.be.equal(2000000001);
    expect(res.body.data.status).to.be.equal('dormant');
  });

  it(`should return No account found/Incorrect account number when changing 
the status of an account with a wrong account number`, async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/accounts/200024544')
      .set('Authorization', adminToken)
      .send({
        status: 'active',
      });
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be
      .equal('No account found/Incorrect account number');
  });

  it(`should return Please select an appropriate status if the 
status is not a valid status`, async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/accounts/2000000001')
      .set('Authorization', adminToken)
      .send({
        status: 'wrongstatus',
      });
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error[0]).to.be
      .equal('Please select an appropriate status');
  });

  it('should return all transactions for an account Number', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/accounts/2000000000/transactions')
      .set('Authorization', adminToken);
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data[0].id).to.be.equal(1);
    expect(res.body.data[0].type).to.be.equal('credit');
    expect(res.body.data[0].account_number).to.be.equal(2000000000);
    expect(res.body.data[0].cashier).to.be.equal(2);
    expect(res.body.data[0].amount).to.be.equal('3000.00');
    expect(res.body.data[0].old_balance).to.be.equal('4000.00');
    expect(res.body.data[0].new_balance).to.be.equal('7000.00');
  });

  it('should return you are not authorized to view this transaction',
    async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/accounts/2000000000/transactions')
        .set('Authorization', clientToken);
      expect(res.body.status).to.be.equal(400);
      expect(res.body).to.have.key('status', 'error');
      expect(res.body.error).to.be
        .equal('You are not authorized to view this transaction');
    });

  it('should return you are not authorized to view this transaction',
    async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/accounts/2000000000')
        .set('Authorization', clientToken);
      expect(res.body.status).to.be.equal(400);
      expect(res.body).to.have.key('status', 'error');
      expect(res.body.error).to.be
        .equal('You are not authorized to view this transaction');
    });

  it('should delete a user bank account', async () => {
    const res = await chai
      .request(app)
      .delete('/api/v1/accounts/2000000001')
      .set('Authorization', adminToken);
    expect(res.body.status).to.be.equal(202);
    expect(res.body.data).to.be
      .equal('Account Number 2000000001 successfully deleted');
  });

  it('should return No account found/Incorrect account number', async () => {
    const res = await chai
      .request(app)
      .delete('/api/v1/accounts/20000133')
      .set('Authorization', adminToken);
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be
      .equal('No account found/Incorrect account number');
  });

  it('should return accountdetails of a user', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/accounts/2000000000')
      .set('Authorization', adminToken);
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data).to.have
      .key('id', 'account_number', 'email', 'owner', 'type',
        'status', 'balance', 'created_on', 'updated_at');
    expect(res.body.data.account_number).to.be.equal(2000000000);
    expect(res.body.data.email).to.be.equal('martin@gmail.com');
    expect(res.body.data.owner).to.be.equal(3);
    expect(res.body.data.type).to.be.equal('savings');
    expect(res.body.data.balance).to.be.equal('4000.00');
    expect(res.body.data.status).to.be.equal('dormant');
  });

  it('should return accountdetails of a user', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/accounts/20000000005')
      .set('Authorization', adminToken);
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body).to.have.key('status', 'error');
    expect(res.body.error).to.be.equal('Account number not found');
  });

  it('should return all accounts in the app', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/accounts')
      .set('Authorization', adminToken);
    expect(res).to.have.status(200);
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data[0]).to.have
      .key('account_number', 'type', 'status',
        'balance', 'created_on', 'email');
    expect(res.body.data[0].account_number).to.be.equal(2000000000);
    expect(res.body.data[0].email).to.be.equal('martin@gmail.com');
    expect(res.body.data[0].type).to.be.equal('savings');
    expect(res.body.data[0].balance).to.be.equal('4000.00');
    expect(res.body.data[0].status).to.be.equal('dormant');
  });

  it('should return all active accounts in the app', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/accounts?status=active')
      .set('Authorization', adminToken);
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data[0]).to.have
      .key('account_number', 'type', 'status', 'balance',
        'created_on', 'email');
    expect(res.body.data[0].account_number).to.be.equal(2000000003);
    expect(res.body.data[0].email).to.be.equal('victor@gmil.com');
    expect(res.body.data[0].type).to.be.equal('savings');
    expect(res.body.data[0].balance).to.be.equal('2000.00');
    expect(res.body.data[0].status).to.be.equal('active');
  });

  it('should return all dormant accounts in the app', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/accounts?status=dormant')
      .set('Authorization', adminToken);
    expect(res).to.have.status(200);
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data[0]).to.have
      .key('account_number', 'type', 'status',
        'balance', 'created_on', 'email');
    expect(res.body.data[0].account_number).to.be.equal(2000000000);
    expect(res.body.data[0].email).to.be.equal('martin@gmail.com');
    expect(res.body.data[0].type).to.be.equal('savings');
    expect(res.body.data[0].balance).to.be.equal('4000.00');
    expect(res.body.data[0].status).to.be.equal('dormant');
  });

  it('should return error for improper status', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/accounts?status=somestatus')
      .set('Authorization', adminToken);
    expect(res).to.have.status(400);
    expect(res.body.status).to.be.equal(400);
    expect(res.body).to.have.key('status', 'error');
    expect(res.body.error).to.be.equal('Invalid status');
  });


  it('statusAccounts(status) should return the status account found',
    async () => {
      const status = 'dormant';
      const accountDetails = await AccountService.statusAccounts(status);
      expect(accountDetails[0]).to.have
        .key('account_number', 'type', 'status',
          'balance', 'created_on', 'email');
      expect(accountDetails[0].account_number).to.be.equal(2000000000);
      expect(accountDetails[0].email).to.be.equal('martin@gmail.com');
      expect(accountDetails[0].type).to.be.equal('savings');
      expect(accountDetails[0].balance).to.be.equal('4000.00');
      expect(accountDetails[0].status).to.be.equal('dormant');
    });

  it('statusAccounts(status) should return the error for wrong status input',
    async () => {
      const status = 'something wrong';
      const accountDetails = await AccountService.statusAccounts(status);
      expect(accountDetails).to.have.key('error', 'err');
      expect(accountDetails.error).to.be.equal(true);
      expect(accountDetails.err).to.be.equal('Invalid status');
    });

  it(`findAccountByAccountNumber(accountNumber) 
should return the account Details found`, async () => {
    const accountDetails = await AccountService
      .findAccountByAccountNumber(2000000002);
    expect(accountDetails).to.have
      .key('id', 'account_number', 'created_on', 'owner',
        'type', 'status', 'balance');
    expect(accountDetails.account_number).to.be.equal(2000000002);
    expect(accountDetails.type).to.be.equal('current');
    expect(accountDetails.balance).to.be.equal('2000.00');
    expect(accountDetails.status).to.be.equal('active');
  });

  it(`checkDormantAccount(accountNumber)should return true 
if account is dormant`, async () => {
    const checkDormant = await AccountService.checkDormantAccount(2000000001);
    expect(checkDormant).to.be.equal(false);
  });

  it(`checkDormantAccount(accountNumber)should return false 
if account is not dormant`, async () => {
    const checkDormant = await AccountService.checkDormantAccount(2000000002);
    expect(checkDormant).to.be.equal(false);
  });

  it('generateAccountNumber()should return a generated account Number',
    async () => {
      const checkDormant = await AccountService.generateAccountNumber();
      expect(checkDormant).to.be.a('number');
    });

  it(`findAccountByAccountNumber(accountNumber) should return 
the account Details found`, async () => {
    const accountDetails = await AccountService
      .findAccountByAccountNumber(2000000002);
    expect(accountDetails).to.have
      .key('id', 'account_number', 'created_on', 'owner',
        'type', 'status', 'balance');
    expect(accountDetails.account_number).to.be.equal(2000000002);
    expect(accountDetails.type).to.be.equal('current');
    expect(accountDetails.balance).to.be.equal('2000.00');
    expect(accountDetails.status).to.be.equal('active');
  });

  it(`findAccountByAccountNumber(wrongAccountNumber) 
No account found/Incorrect account number`, async () => {
    const accountDetails = await AccountService
      .findAccountByAccountNumber(2000055);
    expect(accountDetails.message).to.be
      .equal('No account found/Incorrect account number');
  });

  it('updateAccountBalance(balance, accountNumber) return an error',
    async () => {
      const updateAccount = await AccountService
        .updateAccountBalance('three thousand', 'account');
      expect(updateAccount.error).to.be.equal(true);
      expect(updateAccount.err).to.be
        .equal('invalid input syntax for type numeric: "three thousand"');
    });

  it('updateAccountBalance(balance, accountNumber) return an error',
    async () => {
      const deletedAccount = await AccountService
        .deleteAccount('three thousand');
      expect(deletedAccount.error).to.be.equal(true);
      expect(deletedAccount.err).to.be
        .equal('No account found/Incorrect account number');
    });

  it('allTransactions(accountNumber) return an error', async () => {
    const allTransactions = await AccountService
      .allTransactions('three thousand');
    expect(allTransactions.error).to.be.equal(true);
    expect(allTransactions.err).to.be
      .equal('invalid input syntax for integer: "NaN"');
  });

  it('createAccount(accountDetails, type) return an error', async () => {
    const accountDetails = { email: 'dodo@gmail.com', id: 15 };
    const type = 1;
    const newAccount = await AccountService.createAccount(accountDetails, type);
    expect(newAccount.error).to.be.equal(true);
    expect(newAccount.err).to.be
      .equal('User not found, please check the request');
  });

  it('changeStatus(type, accountNumber) return an error', async () => {
    const type = 'dami';
    const accountNumber = 2000000002;
    const changeStatus = await AccountService.changeStatus(type, accountNumber);
    expect(changeStatus.error).to.be.equal(true);
    expect(changeStatus.err).to.be
      .equal('Invalid status');
  });


  it('allAccounts() should return all the account found', async () => {
    const accountDetails = await AccountService.allAccounts();
    expect(accountDetails[0]).to.have
      .key('account_number', 'type', 'status', 'balance',
        'created_on', 'email');
    expect(accountDetails[0].account_number).to.be.equal(2000000000);
    expect(accountDetails[0].email).to.be.equal('martin@gmail.com');
    expect(accountDetails[0].type).to.be.equal('savings');
    expect(accountDetails[0].balance).to.be.equal('4000.00');
    expect(accountDetails[0].status).to.be.equal('dormant');
  });

  it('allAccounts() should return all accounts', async () => {
    const accountDetails = await AccountService.allAccounts();
    expect(accountDetails[0]).to.have
      .key('account_number', 'type', 'status',
        'balance', 'created_on', 'email');
    expect(accountDetails[0].account_number).to.be.equal(2000000000);
    expect(accountDetails[0].email).to.be.equal('martin@gmail.com');
    expect(accountDetails[0].type).to.be.equal('savings');
    expect(accountDetails[0].balance).to.be.equal('4000.00');
    expect(accountDetails[0].status).to.be.equal('dormant');
  });
});
