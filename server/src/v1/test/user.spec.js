/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4LCJlbWFpbCI6ImRvaW5nQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IlNldW4iLCJsYXN0TmFtZSI6Ik1pZGUiLCJwYXNzd29yZCI6ImJhbmthcHAiLCJ0eXBlIjoiYWRtaW4iLCJpc0FkbrcEj19uSMXKjEzesCpPmYiED7Cc';

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
          password: 'Bankappclient2@',
          confirm_password: 'Bankappclient2@',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'type');
          expect(res.body.data.email).to.be.equal('dami@gmail.com');
          expect(res.body.data.firstName).to.be.equal('damilola');
          expect(res.body.data.lastName).to.be.equal('Koya');
          expect(res.body.data.type).to.be.equal('client');
          done();
        });
    });

    it('should return Please enter your first name if the firstName is missing', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'damilo@gmail.com',
          firstName: '2',
          lastName: 'Koya',
          password: 'bankappclient',
          confirm_password: 'bankappclient',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error[0]).to.be.equal('Must be only alphabetical chars');

          done();
        });
    });

    it('should return Must be only alphabetical chars if the lastName is has a number', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'taiwo@gmail.com',
          firstName: 'Taiwo',
          lastName: '2',
          password: 'bankappclient',
          confirm_password: 'bankappclient',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error[0]).to.be.equal('Must be only alphabetical chars');

          done();
        });
    });

    it('should return Please enter your last name if the lastName is missing', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'taiwo@gmail.com',
          firstName: 'Taiwo',
          lastName: '',
          password: 'bankappclient',
          confirm_password: 'bankappclient',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error[0]).to.be.equal('Must be only alphabetical chars');

          done();
        });
    });

    it('should return Please enter a valid email if the email is not a type of email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'dami.gmail.com',
          firstName: 'Felix',
          lastName: 'Koya',
          password: 'bankappclient',
          confirm_password: 'bankappclient',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error[0]).to.be.equal('Please enter a valid email');

          done();
        });
    });

    it('should return Pasword can not be less than 6 characters if no password is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'tobi@gmail.com',
          firstName: 'Tobi',
          lastName: 'Koya',
          password: 'dami',
          confirm_password: 'dami',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error[0]).to.be.equal('Pasword can not be less than 6 characters');

          done();
        });
    });
    it('should return passwords must match if passwords do not match', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'tobi@gmail.com',
          firstName: 'Tobi',
          lastName: 'Koya',
          password: 'damil',
          confirm_password: 'dami',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('passwords must match');

          done();
        });
    });
    it('should return Email exist already, please login to conitnue for user registering with an exisiting email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'dharmykoya38@gmail.com',
          firstName: 'Tobi',
          lastName: 'Koya',
          password: 'damilola',
          confirm_password: 'damilola',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.status).to.be.equal(409);
          expect(res.body.error).to.be.equal('Email exist already, please login to conitnue');

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
          expect(res.body.data.email).to.be.equal('doyin@gmail.com');
          expect(res.body.data.firstName).to.be.equal('Doyin');
          expect(res.body.data.lastName).to.be.equal('Wole');
          expect(res.body.data.type).to.be.equal('staff');
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
          expect(res.body.error[0]).to.be.equal('Please enter a valid email');
          done();
        });
    });

    it('should return JsonWebTokenError if a wrong token was provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .send({
          email: 'doyin.gmail.com',
          password: 'bankappstaff',
        })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.status).to.be.equal(500);
          expect(res.body.error.name).to.be.equal('JsonWebTokenError');
          expect(res.body.error.message).to.be.equal('jwt malformed');
          done();
        });
    });
  });
});
