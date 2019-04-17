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
  return true;
});

pool.on('error', (err) => {
  if (err) {
    return err;
  }
  return true;
});
