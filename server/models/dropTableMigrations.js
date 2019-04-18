import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('connected to the database');
});

/**
 * Create Tables
 */
const DropTableMigrations = (queryText) => {
  pool
    .query(queryText)
    .then(res => res)
    .catch(err => err);
};

pool.on('remove', () => process.exit(0));

const QueryText = 'DROP TABLE IF EXISTS users, accounts';
DropTableMigrations(QueryText);
