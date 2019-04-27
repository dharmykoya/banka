/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test for the App entry point', () => {
  it('Should return Welcome message', () => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to
          .equal('Welcome to Banka App by Damilola Adekoya');
      });
  });
  it('Should throw error', () => {
    chai
      .request(app)
      .get('/damilola')
      .end((err, res) => {
        expect(res.body).to.have.key('status', 'error', 'success', 'message');
        expect(res.body.message).to
          .equal('Route Does not Exist');
      });
  });
  it('Should return Welcome message', () => {
    chai
      .request(app)
      .get('/api/v1/user')
      .end((err, res) => {
        expect(res.body).to.have.key('status', 'error', 'success', 'message');
        expect(res.body.message).to
          .equal('Route Does not Exist');
      });
  });
});
