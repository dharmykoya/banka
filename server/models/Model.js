import { Pool } from 'pg';

class Model {
  constructor(table) {
    this.table = table;
    this.pool = Model.initConn();
    this.pool.on('error', err => err);
  }

  static initConn() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    return pool;
  }

  /**
   * @description Insert into user table
   * @static
   * @param {Object} query
   * @returns {Object}  user created
   * @memberof Model
   */
  async Insert(...query) {
    try {
      const values = [...query];
      const sql = `insert into ${this.table} (email, first_name, last_name, password, type) values($1, $2, $3, $4, $5) returning *`;
      const res = await this.pool.query(sql, values);
      return res.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * @description returns all rows from any table
   * @static
   * @param {Object} column
   * @param {Object} param
   * @returns {Object}  row found
   * @memberof Model
   */
  async Find(column, param) {
    try {
      const result = await this.pool.query(`select * from ${this.table} where ${column} = '${param}'`);
      return result.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description returns a single row from any table
   * @static
   * @param {Object} column
   * @param {Object} param
   * @returns {Object}  row found
   * @memberof Model
   */
  async FindOne(column, param) {
    try {
      const res = await this.pool.query(`select * from ${this.table} where ${column} = '${param}'`);
      return res.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Find a single row from any table
   * @static
   * @param {Object} column
   * @param {Object} param
   * @returns {Object}  row found
   * @memberof Model
   */
  async FindByEmail(email) {
    const values = [email];
    try {
      const sql = `select * from ${this.table} where email = $1`;
      const res = await this.pool.query(sql, values);
      return res.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Find the last accountNumber in the table
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async FindLastAccountNumber() {
    try {
      const sql = `select account_number from ${this.table} order by created_on desc limit 1`;
      const result = await this.pool.query(sql);
      return result.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Insert a neew Record into the accounts table
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async InsertAccount(...query) {
    try {
      const values = [...query];
      const sql = `insert into ${this.table} (account_number, owner, type, balance) values($1, $2, $3, $4) returning *`;
      const res = await this.pool.query(sql, values);
      return res.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Insert a neew Record into the transactions table
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async InsertTransaction(...query) {
    try {
      const values = [...query];
      const sql = `insert into ${this.table} (type, account_number, cashier, amount, old_balance, new_balance) values($1, $2, $3, $4, $5, $6) returning *`;
      const res = await this.pool.query(sql, values);
      return res.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Insert a neew Record into the accounts table
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async UpdateAccountStatus(status, accountNumber) {
    const values = [status, accountNumber];
    try {
      const sql = `update ${this.table} set status = $1 where account_number = $2`;
      const res = await this.pool.query(sql, values);
      return res.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Insert a neew Record into the accounts table
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async FindByAccountNumber(accountNumber) {
    const values = [accountNumber];
    try {
      const sql = `select id, type, created_on, account_number, owner, status, balance from ${this.table} where account_number = $1`;
      const res = await this.pool.query(sql, values);
      return res.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Delete a record from the account table
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async DeleteAccount(accountNumber) {
    const values = [accountNumber];
    try {
      const sql = `delete from ${this.table} where account_number = $1`;
      const res = await this.pool.query(sql, values);
      return res.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description update a record in the account table
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async UpdateAccountBalance(balance, accountNumber) {
    const values = [balance, accountNumber];
    try {
      const sql = `update ${this.table} set balance = $1 where account_number = $2`;
      const res = await this.pool.query(sql, values);
      return res.rows;
    } catch (error) {
      return error;
    }
  }
}

export default Model;
