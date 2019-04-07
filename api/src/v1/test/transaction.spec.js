/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import TransactionService from '../services/transaction.service';

const { expect } = chai;
const minBalance = 1000;

chai.use(chaiHttp);


it(`should return You can not have less than ${minBalance} in your account.`, (done) => {
  chai
    .request(app)
    .post('/api/v1/transactions/2000000001/debit')
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
    .post('/api/v1/transactions/2000000002/credit')
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
    .post('/api/v1/transactions/2000000002/debit')
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
describe('Transaction Resource', () => {
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
  it('should return No account found/Incorrect account number on credit request', (done) => {
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
  it('should return No account found/Incorrect account number on debit request', (done) => {
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

  it('transactionAction()should return a debit transaction', () => {
    const transaction = TransactionService.transactionAction('debit', 6, 1, 2000000005, 30000, 70000);
    expect(transaction).to.have.key('transactionId', 'accountNumber', 'amount', 'cashier', 'transactionType', 'accountBalance');
  });

  it('transactionAction()should return a credit transaction', () => {
    const transaction = TransactionService.transactionAction('credit', 6, 1, 2000000005, 30000, 70000);
    expect(transaction).to.have.key('transactionId', 'accountNumber', 'amount', 'cashier', 'transactionType', 'accountBalance');
  });
});
