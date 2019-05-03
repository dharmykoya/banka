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
    it('should add a new user and return a token', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'dami@gmail.com',
          firstName: 'damilola',
          lastName: 'Koya',
          password: 'Bankappclient2@',
          confirmPassword: 'Bankappclient2@',
          type: 'client',
        });
      expect(res.body.status).to.be.equal(201);
      expect(res.body.data).to.have
        .key('id', 'token', 'email', 'firstName', 'lastName',
          'type', 'isAdmin');
      expect(res.body.data.email).to.be.equal('dami@gmail.com');
      expect(res.body.data.firstName).to.be.equal('damilola');
      expect(res.body.data.lastName).to.be.equal('koya');
      expect(res.body.data.type).to.be.equal('client');
    });
    it('should add a new user and return a token', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'damilola@gmail.com',
          firstName: 'damilola',
          lastName: 'Koya',
          password: 'Bankappclient2@',
          confirmPassword: 'Bankappclient2@',
          type: 'client',
        });
      expect(res.body.status).to.be.equal(201);
      expect(res.body.data).to.have
        .key('id', 'token', 'email', 'firstName', 'lastName', 'type',
          'isAdmin');
      expect(res.body.data.email).to.be.equal('damilola@gmail.com');
      expect(res.body.data.firstName).to.be.equal('damilola');
      expect(res.body.data.lastName).to.be.equal('koya');
      expect(res.body.data.type).to.be.equal('client');
    });

    it(`should return Please enter your first name if the 
    firstName is missing`, async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'damilo@gmail.com',
          firstName: '2',
          lastName: 'Koya',
          password: 'bankappclient',
          confirmPassword: 'bankappclient',
          type: 'client',
        });
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be
        .equal('First name must be only alphabetical chars');
    });

    it(`should return Must be only alphabetical chars if the 
    lastName is has a number`, async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'taiwo@gmail.com',
          firstName: 'Taiwo',
          lastName: '2',
          password: 'bankappclient',
          confirmPassword: 'bankappclient',
          type: 'client',
        });
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be
        .equal('Last name must be only alphabetical chars');
    });

    it('should return Please enter your last name if the lastName is missing',
      async () => {
        const res = await chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send({
            email: 'taiwo@gmail.com',
            firstName: 'Taiwo',
            lastName: '',
            password: 'bankappclient',
            confirmPassword: 'bankappclient',
            type: 'client',
          });
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error[0]).to.be
          .equal('Last name must be only alphabetical chars');
      });

    it(`should return Please enter a valid email if the email 
    is not a type of email`, async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'dami.gmail.com',
          firstName: 'Felix',
          lastName: 'Koya',
          password: 'bankappclient',
          confirmPassword: 'bankappclient',
          type: 'client',
        });
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be.equal('Please enter a valid email');
    });

    it(`should return Pasword can not be less than 6 characters 
    if no password is provided`, async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'tobi@gmail.com',
          firstName: 'Tobi',
          lastName: 'Koya',
          password: 'dami',
          confirmPassword: 'dami',
          type: 'client',
        });
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be
        .equal('Pasword can not be less than 8 characters');
    });
    it('should return passwords must match if passwords do not match',
      async () => {
        const res = await chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send({
            email: 'tobi@gmail.com',
            firstName: 'Tobi',
            lastName: 'Koya',
            password: 'damil',
            confirmPassword: 'dami',
            type: 'client',
          });
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error).to.be.equal('passwords must match');
      });
  });

  /**
   * test for SignIn endpoint
   * to see if the res body is an object
   */
  describe('Signin user endpoint', () => {
    it('should let a user gain access to the app and create a token',
      async () => {
        const res = await chai
          .request(app)
          .post('/api/v1/auth/signin')
          .send({
            email: 'dharmykoya38@gmail.com',
            password: 'BankappClient132@',
          });
        staffToken = `Bearer ${res.body.data.token}`;
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.have
          .key('id', 'token', 'email', 'firstName',
            'lastName', 'type', 'isAdmin');
        expect(res.body.data.email).to.be.equal('dharmykoya38@gmail.com');
        expect(res.body.data.firstName).to.be.equal('Damilola');
        expect(res.body.data.lastName).to.be.equal('Adekoya');
        expect(res.body.data.type).to.be.equal('staff');
      });

    it(`should return Authentication failed.Email/Wrong password 
    for wrong password`, async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'dharmykoya38@gmail.com',
          password: 'BankappClient',
        });
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be
        .equal('Authentication failed.Email/Wrong password.');
    });

    it('should return No user found/Incorrect email or password', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'doyhgggfgf@gmail.com',
          password: 'bankappstaff',
        });
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be
        .equal('Email is not registered on this app. Please signup.');
    });

    it('should return Please enter a valid mail', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'doyin.gmail.com',
          password: 'bankappstaff',
        });
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be.equal('Please enter a valid email');
    });

    it('should return JsonWebTokenError if a wrong token was provided',
      async () => {
        const res = await chai
          .request(app)
          .post('/api/v1/accounts')
          .set('Authorization', token)
          .send({
            email: 'doyin.gmail.com',
            password: 'bankappstaff',
          });
        expect(res.body.status).to.be.equal(500);
        expect(res.body.error.name).to.be.equal('JsonWebTokenError');
        expect(res.body.error.message).to.be.equal('jwt malformed');
      });

    it('should return all accounts owned by a user', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/user/${email}/accounts`)
        .set('Authorization', staffToken);
      expect(res.body.status).to.be.equal(200);
      expect(res.body.data[0]).to.have
        .key('id', 'account_number', 'owner', 'type',
          'status', 'balance', 'created_on', 'updated_at');
      expect(res.body.data[0].account_number).to.be.equal(2000000002);
      expect(res.body.data[0].owner).to.be.equal(4);
      expect(res.body.data[0].type).to.be.equal('current');
      expect(res.body.data[0].status).to.be.equal('active');
      expect(res.body.data[0].balance).to.be.equal('2000.00');
    });

    it('should return user has no accounts', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/user/${noAccountEmail}/accounts`)
        .set('Authorization', staffToken);
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be
        .equal(`user ${noAccountEmail} has no accounts`);
    });

    it('should return all accounts owned by a user', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/user/1')
        .set('Authorization', staffToken);
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be
        .equal('user Damilola Adekoya has no accounts');
    });

    it('should return all accounts owned by a user', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/user/4')
        .set('Authorization', staffToken);
      expect(res.body.status).to.be.equal(200);
      expect(res.body.data[0].id).to.be.equal(3);
      expect(res.body.data[0].type).to.be.equal('current');
      expect(res.body.data[0].status).to.be.equal('active');
      expect(res.body.data[0].account_number).to.be.equal(2000000002);
      expect(res.body.data.formatDetail.id).to.be.equal(4);
      expect(res.body.data.formatDetail.email).to.be.equal('victor@gmil.com');
      expect(res.body.data.formatDetail.firstName).to.be.equal('victor');
    });
    it('should return no user found for an id not in the app', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/user/76')
        .set('Authorization', staffToken);
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('no user found');
    });
    it('should return no user found for an id not in the app', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/user/+76')
        .set('Authorization', staffToken);
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be.equal('User ID must be a number');
    });
    it('should return no user found for an id not in the app', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/user/-76')
        .set('Authorization', staffToken);
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be.equal('User ID must be a number');
    });
    it('should return no user found for an id not in the app', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/user/-')
        .set('Authorization', staffToken);
      expect(res.body.status).to.be.equal(422);
      expect(res.body.error[0]).to.be.equal('Invalid value');
      expect(res.body.error[1]).to.be.equal('User ID must be a number');
    });

    it('findUserById(id) should return a user', async () => {
      const id = 3;
      const userAccounts = await UserService.findUserById(id);
      expect(userAccounts.id).to.be.equal(3);
      expect(userAccounts).to.have
        .key('id', 'email', 'first_name', 'last_name', 'type',
          'profile_image', 'admin', 'created_at', 'updated_at', 'password');
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
    it('should return no user found', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/user/${wrongUserEmail}/accounts`)
        .set('Authorization', staffToken);
      expect(res).to.have.status(400);
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('no user found');
    });

    it('should upload a picture for a user', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/user/upload')
        .set('Authorization', staffToken)
        .attach('profileImage',
          ('./server/test/testImages/git_pic.jpeg'), 'image.jpeg');
      expect(res).to.have.status(200);
      expect(res.body.status).to.be.equal(200);
      expect(res.body.data).to.be.equal('file uploaded successfully');
    });

    it('should return error for wrong format uploaded', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/user/upload')
        .set('Authorization', staffToken)
        .attach('profileImage',
          ('./server/test/testImages/testdoc.docx'), 'image.jpeg');
      expect(res.body.status).to.be.equal(500);
      expect(res.body.message).to.be.equal('This image format is not allowed');
    });

    it('uploadPicture(path, id) should return error for no path', async () => {
      const path = 'uploads\testing.png';
      const id = 'two';
      const uploadPic = await UserService.uploadPicture(path, id);
      expect(uploadPic.err).to.be.equal('upload failed');
    });

    it(`userAccounts(email) should return user has no account 
    for email without an account`, async () => {
      const userAccounts = await UserService.userAccounts(noAccountEmail);
      expect(userAccounts.err).to.be
        .equal(`user ${noAccountEmail} has no accounts`);
    });

    it(`userAccounts(email) should return user has no account for 
    email not registered on the platform`, async () => {
      const userAccounts = await UserService.userAccounts(wrongUserEmail);
      expect(userAccounts.err).to.be.equal('no user found');
    });
  });
});
