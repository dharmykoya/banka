/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('The authentication endpoint test', () => {
  /**
   * test for Signup endpoint
   * to see if the res body is an object
   */
  describe('Signup user endpoint', () => {
    it('should add a new user and return a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'dami.gmail.com',
          firstName: 'damilola',
          lastName: 'Koya',
          password: 'bankappclient',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'password', 'type');
          done();
        });
    });

    it('should return missing parameters, please fill all fields if no firstName is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'dami.gmail.com',
          firstName: '',
          lastName: 'Koya',
          password: 'bankappclient',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('missing parameters, please fill all fields');

          done();
        });
    });
  });
});
