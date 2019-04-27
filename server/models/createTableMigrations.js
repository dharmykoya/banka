
/**
 * Create Tables
 */
import Model from './Model';
import SQL from './sql';


const model = new Model();
const createTablesSchema = async () => {
  const sql = SQL.UsersTable;
  await model.pool.query(sql);
};

const superAdmin = async () => {
  const sql = SQL.SuperAdmin;
  await model.pool.query(sql);
};

const staff = async () => {
  const sql = SQL.Staff;
  await model.pool.query(sql);
};

const client = async () => {
  const sql = SQL.Client;
  await model.pool.query(sql);
};

const accountA = async () => {
  const sql = SQL.AccountA;
  await model.pool.query(sql);
};

const accountB = async () => {
  const sql = SQL.AccountB;
  await model.pool.query(sql);
};

const transactionA = async () => {
  const sql = SQL.TransactionA;
  await model.pool.query(sql);
};

const transactionB = async () => {
  const sql = SQL.TransactionB;
  await model.pool.query(sql)
    .then(res => res)
    .catch(err => err);
};

const transactionC = async () => {
  const sql = SQL.TransactionC;
  await model.pool.query(sql);
};

const transactionD = async () => {
  const sql = SQL.TransactionD;
  await model.pool.query(sql);
};


model.pool.on('remove', () => process.exit(0));

(async () => {
  try {
    await createTablesSchema();
    await superAdmin();
    await staff();
    await client();
    await accountA();
    await accountB();
    await transactionA();
    await transactionB();
    await transactionC();
    await transactionD();
    return true;
  } catch (error) {
    return error;
  }
})();
