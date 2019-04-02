/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('The endpoint for Account Resource', () => {
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
});
