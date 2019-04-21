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
    const transaction = await model.InsertTransaction(type, accountNumber, cashier, amount, oldBalance, newBalance);
    expect(transaction).to.have.key('id', 'account_number', 'amount', 'cashier', 'type', 'old_balance', 'new_balance', 'created_on');
    expect(transaction.account_number).to.be.equal(2000000005);
    expect(transaction.new_balance).to.be.equal('2000.00');
    expect(transaction.amount).to.be.equal('2000.00');
    expect(transaction.cashier).to.be.equal(2);
    expect(transaction.type).to.be.equal('credit');
    expect(transaction.id).to.be.equal(9);
  });
});
