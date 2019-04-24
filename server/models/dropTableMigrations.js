import Model from './Model';

/**
 * Drop Tables
 */
const model = new Model();
const DropTableMigrations = async (queryText) => {
  try {
    await model.pool.query(queryText);
  } catch (err) {
    return err;
  }
};
model.pool.on('remove', () => process.exit(0));

const QueryText = 'DROP TABLE IF EXISTS users, accounts, transactions';
DropTableMigrations(QueryText);
