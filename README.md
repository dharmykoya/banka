# Banka
Banka is a light-weight core banking application that powers banking operations like account  creation, customer deposit and withdrawals. This app is meant to support a single bank, where  users can signup and create bank accounts online.

[![Build Status](https://travis-ci.org/dharmykoya/banka.svg?branch=develop)](https://travis-ci.org/dharmykoya/banka) [![Maintainability](https://api.codeclimate.com/v1/badges/752844bdd365e48cd9d7/maintainability)](https://codeclimate.com/github/dharmykoya/banka/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/752844bdd365e48cd9d7/test_coverage)](https://codeclimate.com/github/dharmykoya/banka/test_coverage) [![Coverage Status](https://coveralls.io/repos/github/dharmykoya/banka/badge.svg)](https://coveralls.io/github/dharmykoya/banka)


**UI template:** (https://dharmykoya.github.io/banka/UI/index)
**API link:** (https://dharmykoya.github.io/banka/UI/index)

## Project Management Tool

**Pivotal Tracker:** Project is currently being managed with pivotal tracker, at https://www.pivotaltracker.com/n/projects/2320086

## Built With
- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org)
- [Express](https://expressjs.com)
- [PostgresSQL](https://postgresql.org)

## Features
- User (client) can sign up.  
- User (client) can login.  
- User (client) can create an account.  
- Staff (cashier) can debit user (client) account.  
- Staff (cashier) can credit user (client) account.  
- Admin/staff can activate or deactivate an account. 

## Installation
1. Ensure you have Node.js and npm installed

2. Clone this repo
```bash
$ git clone https://github.com/dharmykoya/banka.git
```
3. Install Dependencies
```bash
npm install
```
4. Start server
```bash
npm start
```

## Supporting Packages
#### Linter
- [ESLint](https://eslint.org/) - Linter Tool

#### Compiler
- [Babel](https://eslint.org/) - Compiler for Next Generation JavaScript

#### Test-Driven Development

- [Mocha](https://mochajs.org/) 
- [Chai](http://chaijs.com/)
- [Chai-http](https://github.com/visionmedia/supertest)
- [Istanbul(nyc)](https://istanbul.js.org/)


1. Clone this repo
```bash
$ git clone https://github.com/dharmykoya/banka.git
```
2. Install Dependencies
```bash
npm install
```
4. Run Test
```bash
npm run test-watch
```
5. Run Coverage Report
```bash
npm run coverage
```

#### Continuous Integration
    * Travis CI & Codeclimate for test automation
    * Coveralls for test coverage report

## API Routes

|        DESCRIPTION        | HTTP METHOD | ROUTES                               |
| :-----------------------: | ----------- | ------------------------------------ |
|       Sign up User        | POST        | /api/v1/auth/signup                  |
|        Log in User        | POST        | /api/v1/auth/signin                  |
|   Create a bank account   | POST        | /api/v1/accounts                     |
|  Activate a bank account  | PATCH       | /api/v1/accounts/account-number      |
| Deactivate a bank account | PATCH       | /api/v1/accounts/{account-number}    |
|   Delete a bank account   | DELETE      | /api/v1/accounts/{account-number}    |
|   Credit a bank account   | POST        | /api/v1/tranactions/account-number/credit |
|   Debit a bank account    | POST         | /api/v1/tranactions/account-number/debit |

## Project References

- I learnt how to build and structure my project backend with this tutorial by Bolaji Olajide - https://www.youtube.com/watch?v=WLIqvJzD9DE
- I learnt how to implement Authentication with JWT with this tutorial by Academind - https://www.youtube.com/watch?v=0D5EEKH97NA
- Huge Appreciation to Ekunola Ezekiel for letting me use his project as reference - https://github.com/Easybuoy/storemanager
- StackOverflow

## License

&copy; Damilola Adekoya

Licensed under the [MIT License](https://github.com/dharmykoya/banka/blob/develop/LICENSE)