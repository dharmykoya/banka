/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Model from '../models/Model';

const { expect } = chai;


chai.use(chaiHttp);

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
    expect(transaction).to.have.key('id', 'account_number', 'amount', 'cashier', 'type', 'old_balance', 'new_balance', 'created_on');
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
    const newUser = await model.Insert(email, firstName, lastName, hashPassword, type);
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
});
