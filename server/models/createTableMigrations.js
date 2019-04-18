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
};

export default CreateTableMigrations;
