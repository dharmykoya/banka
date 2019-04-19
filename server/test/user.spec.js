/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import UserService from '../services/user.service';

const { expect } = chai;

chai.use(chaiHttp);
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4LCJlbWFpbCI6ImRvaW5nQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IlNldW4iLCJsYXN0TmFtZSI6Ik1pZGUiLCJwYXNzd29yZCI6ImJhbmthcHAiLCJ0eXBlIjoiYWRtaW4iLCJpc0FkbrcEj19uSMXKjEzesCpPmYiED7Cc';
const email = 'victor@gmil.com';
const noAccountEmail = 'dharmykoya38@gmail.com';
const wrongUserEmail = 'arsenal@gmail.com';
let staffToken;

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
    it('should add a new user and return a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'damilola@gmail.com',
          firstName: 'damilola',
          lastName: 'Koya',
          password: 'Bankappclient2@',
          confirm_password: 'Bankappclient2@',
          type: 'staff',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'type');
          expect(res.body.data.email).to.be.equal('damilola@gmail.com');
          expect(res.body.data.firstName).to.be.equal('damilola');
          expect(res.body.data.lastName).to.be.equal('Koya');
          expect(res.body.data.type).to.be.equal('staff');
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
          expect(res.body.error[0]).to.be.equal('Pasword can not be less than 8 characters');

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
          email: 'dharmykoya38@gmail.com',
          password: 'BankappClient132@',
        })
        .end((err, res) => {
          staffToken = `Bearer ${res.body.data.token}`;
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.data).to.have.key('id', 'token', 'email', 'firstName', 'lastName', 'type');
          expect(res.body.data.email).to.be.equal('dharmykoya38@gmail.com');
          expect(res.body.data.firstName).to.be.equal('Damilola');
          expect(res.body.data.lastName).to.be.equal('Adekoya');
          expect(res.body.data.type).to.be.equal('staff');
          done();
        });
    });

    it('should return Authentication failed.Email/Wrong password for wrong password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'dharmykoya38@gmail.com',
          password: 'BankappClient',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('Authentication failed.Email/Wrong password.');
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
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('Email is not registered on this app. Please signup.');
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

    it('should return all accounts owned by a user', (done) => {
      chai
        .request(app)
        .get(`/api/v1/user/${email}/accounts`)
        .set('Authorization', staffToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.data[0]).to.have.key('id', 'account_number', 'owner', 'type', 'status', 'balance', 'created_on', 'updated_at');
          expect(res.body.data[0].account_number).to.be.equal(2000000002);
          expect(res.body.data[0].owner).to.be.equal(4);
          expect(res.body.data[0].type).to.be.equal('current');
          expect(res.body.data[0].status).to.be.equal('active');
          expect(res.body.data[0].balance).to.be.equal('2000.00');
          done();
        });
    });

    it('should return user has no accounts', (done) => {
      chai
        .request(app)
        .get(`/api/v1/user/${noAccountEmail}/accounts`)
        .set('Authorization', staffToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal(`user ${noAccountEmail} has no accounts`);
          done();
        });
    });

    it('findUserById(id) should return a user', async () => {
      const id = 3;
      const userAccounts = await UserService.findUserById(id);
      expect(userAccounts.id).to.be.equal(3);
      expect(userAccounts).to.have.key('id', 'email', 'first_name', 'last_name', 'type', 'admin', 'created_at', 'updated_at', 'password');
      expect(userAccounts.email).to.be.equal('martin@gmail.com');
      expect(userAccounts.first_name).to.be.equal('Martins');
      expect(userAccounts.last_name).to.be.equal('Oguns');
      expect(userAccounts.type).to.be.equal('client');
    });

    it('findUserById(id) should return ', async () => {
      const id = 1000;
      const foundUser = await UserService.findUserById(id);
      expect(foundUser.message).to.be.equal('No user found');
    });
    it('should return no user found', (done) => {
      chai
        .request(app)
        .get(`/api/v1/user/${wrongUserEmail}/accounts`)
        .set('Authorization', staffToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('no user found');
          done();
        });
    });

    it('userAccounts(email) should return user has no account for email without an account', async () => {
      const userAccounts = await UserService.userAccounts(noAccountEmail);
      expect(userAccounts.err).to.be.equal(`user ${noAccountEmail} has no accounts`);
    });

    it('userAccounts(email) should return user has no account for email not registered on the platform', async () => {
      const userAccounts = await UserService.userAccounts(wrongUserEmail);
      expect(userAccounts.err).to.be.equal('no user found');
    });
  });
});
