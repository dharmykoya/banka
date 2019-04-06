/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

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
        expect(res.body.error).to.have.key('lastName', 'type');
        expect(res.body.error.lastName.msg).to.be.equal('Please enter your last name');
        expect(res.body.error.type.msg).to.be.equal('Please select an appropriate account type');

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
        expect(res.body.error).to.have.key('status');
        expect(res.body.error.status.msg).to.be.equal('Please select an appropriate status');

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
});
