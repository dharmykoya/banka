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
          email: 'dami@gmail.com',
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

    it('should return the missing fields, fields failing validation and their messages', (done) => {
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
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.have.key('firstName', 'email');
          expect(res.body.error.firstName.msg).to.be.equal('Please enter your first name');
          expect(res.body.error.email.msg).to.be.equal('Please enter a valid email');

          done();
        });
    });
  });

  /**
   * test for SignIn endpoint
   * to see if the res body is an object
   */
  describe('Signin user endpoint', () => {
    it('should let a user gain access to the app and create a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'doyin@gmail.com',
          password: 'bankappstaff',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'password', 'type', 'isAdmin');
          done();
        });
    });

    it('should return No user found/Incorrect email or password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'doyhgggfgf@gmail.com',
          password: 'bankappstaff',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body.error).to.be.equal('No user found/Incorrect email or password');
          done();
        });
    });

    it('should return Please enter a valid mail', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'doyin.gmail.com',
          password: 'bankappstaff',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error.email.msg).to.be.equal('Please enter a valid email');
          done();
        });
    });
  });
});
