import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', (err) => {
  if (err) {
    return err;
  }
  // eslint-disable-next-line no-console
  console.log('connected to the database');
  return true;
});

pool.on('error', (err) => {
  if (err) {
    return err;
  }
  return true;
});

/**
 * Create Tables
 */
const CreateTableMigrations = {

  async TypeSchema() {
    const status = `
    CREATE TYPE account_status AS ENUM ('active','dormant')
          `;
    await pool
      .query(status)
      .then(res => res)
      .catch(err => err);
  },

  async UserSchema() {
    const users = `
      CREATE TABLE IF NOT EXISTS users (
              id serial primary key NOT NULL,
              email varchar(128) NOT NULL UNIQUE,
              first_name varchar(128) NOT NULL,
              last_name varchar(128) NOT NULL,
              password varchar(256) NOT NULL,
              type varchar(10) NOT NULL,
              admin BOOLEAN NOT NULL DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
              )
          `;
    await pool
      .query(users)
      .then(res => res)
      .catch(err => err);
  },

  async AccountSchema() {
    const accounts = `
    CREATE TABLE IF NOT EXISTS accounts (
            id serial primary key NOT NULL,
            account_number integer NOT NULL UNIQUE,
            owner integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            type varchar(12) NOT NULL,
            status account_status NOT NULL DEFAULT 'active',
            balance numeric(15, 2) NOT NULL,
            created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            )
        `;
    await pool
      .query(accounts)
      .then(res => res)
      .catch(err => err);
  },

  async TransactionSchema() {
    const transactions = `
    CREATE TABLE IF NOT EXISTS transactions (
            id serial primary key NOT NULL,
            type varchar(12) NOT NULL,
            account_number integer NOT NULL,
            cashier integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            amount numeric(15, 2) NOT NULL,
            old_balance numeric(15, 2) NOT NULL,
            new_balance numeric(15, 2) NOT NULL,
            created_on TIMESTAMP WITH TIME ZONE DEFAULT now()
            )
        `;
    await pool
      .query(transactions)
      .then(res => res)
      .catch(err => err);
  },

  async SuperAdmin() {
    const superAdmin = `
    INSERT INTO users (email, first_name, last_name, password, type, admin)
    VALUES (
      'dharmykoya38@gmail.com', 
      'Damilola', 
      'Adekoya',
      '$2b$08$XsJYgQbVYbBAbbFnyYVP6.Y9OLG0quY7SZVZRL35maIZz1CG4IKFm', 
      'staff', 
      true
    );
        `;
    await pool
      .query(superAdmin)
      .then(res => res)
      .catch(err => err);
  },

  async Staff() {
    const staff = `
    INSERT INTO users (email, first_name, last_name, password, type, admin)
    VALUES (
      'phil@gmail.com', 
      'Phillip', 
      'Newman',
      '$2b$08$XsJYgQbVYbBAbbFnyYVP6.Y9OLG0quY7SZVZRL35maIZz1CG4IKFm', 
      'staff', 
      false
    );
        `;
    await pool
      .query(staff)
      .then(res => res)
      .catch(err => err);
  },

  async Client() {
    const client = `
    INSERT INTO users (email, first_name, last_name, password, type, admin)
    VALUES (
      'martin@gmail.com', 
      'Martins', 
      'Oguns',
      '$2b$08$XsJYgQbVYbBAbbFnyYVP6.Y9OLG0quY7SZVZRL35maIZz1CG4IKFm', 
      'client', 
      false
    );
        `;
    await pool
      .query(client)
      .then(res => res)
      .catch(err => err);
  },

  async AccountA() {
    const account = `
    INSERT INTO accounts (account_number, owner, type, status, balance)
    VALUES (
      '2000000000', 
      '3', 
      'savings',
      'dormant', 
      '4000'
    );
        `;
    await pool
      .query(account)
      .then(res => res)
      .catch(err => err);
  },

  async AccountB() {
    const account = `
    INSERT INTO accounts (account_number, owner, type, status, balance)
    VALUES (
      '2000000001', 
      '3', 
      'current',
      'active', 
      '4000'
    );
        `;
    await pool
      .query(account)
      .then(res => res)
      .catch(err => err);
  },

  async TransactionA() {
    const transaction = `
    INSERT INTO transactions (type, account_number, cashier, amount, old_balance, new_balance)
    VALUES (
      'credit', 
      '2000000000', 
      '2',
      '3000',
      '4000',
      '7000'
    );
        `;
    await pool
      .query(transaction)
      .then(res => res)
      .catch(err => err);
  },
  async TransactionB() {
    const transaction = `
    INSERT INTO transactions (type, account_number, cashier, amount, old_balance, new_balance)
    VALUES (
      'debit', 
      '2000000000', 
      '2',
      '3000', 
      '7000',
      '4000'
    );
        `;
    await pool
      .query(transaction)
      .then(res => res)
      .catch(err => err);
  },

  async TransactionC() {
    const transaction = `
    INSERT INTO transactions (type, account_number, cashier, amount, old_balance, new_balance)
    VALUES (
      'credit', 
      '2000000001', 
      '2',
      '3000',
      '4000', 
      '7000'
    );
        `;
    await pool
      .query(transaction)
      .then(res => res)
      .catch(err => err);
  },
  async TransactionD() {
    const transaction = `
    INSERT INTO transactions (type, account_number, cashier, amount, old_balance, new_balance)
    VALUES (
      'debit', 
      '2000000001', 
      '2',
      '3000',
      '7000', 
      '4000'
    );
        `;
    await pool
      .query(transaction)
      .then(res => res)
      .catch(err => err);
  },
};

export default CreateTableMigrations;
