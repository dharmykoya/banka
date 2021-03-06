/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Model from '../models/Model';
import app from '../index';

const { expect } = chai;


chai.use(chaiHttp);

let clientToken = '';

describe('Test for queries in the Model', () => {
  it('should insert a new data into transaction table', async () => {
    const model = new Model('transactions');
    const type = 'credit';
    const accountNumber = 2000000005;
    const cashier = 2;
    const amount = 2000;
    const oldBalance = 2000;
    const newBalance = 2000;
    const transaction = await model.InsertTransaction(type,
      accountNumber, cashier, amount, oldBalance, newBalance);
    expect(transaction).to.have
      .key('id', 'account_number', 'amount', 'cashier', 'type',
        'old_balance', 'new_balance', 'created_on');
    expect(transaction.account_number).to.be.equal(2000000005);
    expect(transaction.new_balance).to.be.equal('2000.00');
    expect(transaction.amount).to.be.equal('2000.00');
    expect(transaction.cashier).to.be.equal(2);
    expect(transaction.type).to.be.equal('credit');
    expect(transaction.id).to.be.equal(9);
  });

  it('should insert a new data into users table', async () => {
    const model = new Model('users');
    const type = 'client';
    const email = 'dor@gmail.com';
    const firstName = 'Dorcas';
    const lastName = 'shayo';
    const hashPassword = '456@#$*@(JDNSJ';
    const newUser = await model
      .Insert(email, firstName, lastName, hashPassword, type);
    expect(newUser.email).to.be.equal('dor@gmail.com');
    expect(newUser.first_name).to.be.equal('Dorcas');
    expect(newUser.last_name).to.be.equal('shayo');
    expect(newUser.type).to.be.equal('client');
    expect(newUser.id).to.be.equal(10);
  });

  it('should insert a new data into accounts table', async () => {
    const model = new Model('accounts');
    const type = 'current';
    const accountNumber = 2000100005;
    const owner = 2;
    const balance = 2000;
    const newAccount = await model.Insert(accountNumber, owner, type, balance);
    expect(newAccount.account_number).to.be.equal(2000100005);
    expect(newAccount.balance).to.be.equal('2000.00');
    expect(newAccount.owner).to.be.equal(2);
    expect(newAccount.type).to.be.equal('current');
    expect(newAccount.id).to.be.equal(7);
  });
  it('register a client', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Sodiq',
        lastName: 'Fayemi',
        email: 'sodiq@gmil.com',
        password: 'Bankappclient1!',
        confirmPassword: 'Bankappclient1!',
        type: 'client',
      });
    clientToken = `Bearer ${res.body.data.token}`;
    expect(res).to.have.status(201);
    expect(res.body.status).to.be.equal(201);
    expect(res.body.data).to.have.key('id', 'token', 'email',
      'firstName', 'lastName', 'type', 'isAdmin');
    expect(res.body.data.email).to.be.equal('sodiq@gmil.com');
    expect(res.body.data.firstName).to.be.equal('sodiq');
    expect(res.body.data.lastName).to.be.equal('fayemi');
    expect(res.body.data.type).to.be.equal('client');
  });
  it('register a staff', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/addstaff')
      .set('Authorization', clientToken)
      .send({
        firstName: 'Peace',
        lastName: 'Fayemi',
        email: 'peace@gmil.com',
        password: 'Bankappclient1!',
        confirmPassword: 'Bankappclient1!',
      });
    expect(res.body.status).to.be.equal(401);
    expect(res.body).to.have.key('error', 'status');
    expect(res.body.error).to.be
      .equal('You do not have the authorization or right to perform this action');
  });
  it(`should return Email exist already, please login to conitnue 
    for user registering with an exisiting email`, async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'dharmykoya38@gmail.com',
        firstName: 'Tobi',
        lastName: 'Koya',
        password: 'Damilola1@',
        confirmPassword: 'Damilola1@',
        type: 'client',
      });
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be
      .equal('Email exist already, please login to conitnue');
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
    expect(res.body.data.email).to.be.equal('sodiq@gmil.com');
    expect(res.body.data.firstName).to.be.equal('sodiq');
    expect(res.body.data.lastName).to.be.equal('fayemi');
    expect(res.body.data.type).to.be.equal('current');
    expect(res.body.data.openingBalance).to.be.equal(2000);
    expect(res.body.data.status).to.be.equal('active');
  });
  it('should return all transactions for an account Number', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/accounts/2000100006/transactions')
      .set('Authorization', clientToken);
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data).to.be
      .equal('No transaction on this account number yet');
  });
  it('should return all accounts owned by a user', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/user/11')
      .set('Authorization', clientToken);
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data[0].id).to.be.equal(8);
    expect(res.body.data[0].type).to.be.equal('current');
    expect(res.body.data[0].status).to.be.equal('active');
    expect(res.body.data.user.id).to.be.equal(11);
    expect(res.body.data.user.email).to.be.equal('sodiq@gmil.com');
    expect(res.body.data.user.firstName).to.be.equal('sodiq');
  });
  it('should return all accounts owned by a user', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/user/3')
      .set('Authorization', clientToken);
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be
      .equal('You are not authorized to view another account');
  });
  it('should return error when oldpassword does not macth', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', clientToken)
      .send({
        oldPassword: 'Damilol@',
        password: 'Adekoya1@',
        confirmPassword: 'Adekoya1@',
      });
    expect(res.body.status).to.be.equal(400);
    expect(res.body.error).to.be.equal('Please enter your old password');
  });
  it('should return error when oldpassword matches new password', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', clientToken)
      .send({
        oldPassword: 'Adekoya1@',
        password: 'Adekoya1@',
        confirmPassword: 'Adekoya1@',
      });
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error).to.be.equal('you have used this password earlier');
  });
  it('should return error when oldpassword does not macth', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', clientToken)
      .send({
        oldPassword: 'Damilol@',
        password: 'Adekoya1@',
        confirmPassword: 'Adekoya@',
      });
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error).to.be.equal('passwords must match');
  });
  it('should error when changing password with no number', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', clientToken)
      .send({
        oldPassword: 'Bankappclient1!',
        password: 'Adekoya@',
        confirmPassword: 'Adekoya@',
      });
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error[0]).to.be.equal('Password must contain a number');
  });
  it('should error when changing password with no special char', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', clientToken)
      .send({
        oldPassword: 'Bankappclient1!',
        password: 'adekoya1',
        confirmPassword: 'adekoya1',
      });
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error[0]).to.be
      .equal('Password must contain an upper case letter');
    expect(res.body.error[1]).to.be
      .equal('Password must contain a special char');
  });
  it('should error when chaning password with less than 8 chars', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', clientToken)
      .send({
        oldPassword: 'Bankappclient1!',
        password: 'Adek1@',
        confirmPassword: 'Adek1@',
      });
    expect(res.body.status).to.be.equal(422);
    expect(res.body.error[0]).to.be
      .equal('Pasword can not be less than 8 characters');
  });
  it('should change the password of a user', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', clientToken)
      .send({
        oldPassword: 'Bankappclient1!',
        password: 'Adekoya1@',
        confirmPassword: 'Adekoya1@',
      });
    expect(res.body.status).to.be.equal(200);
    expect(res.body.data).to.be.equal('password changed successfully');
  });
});
