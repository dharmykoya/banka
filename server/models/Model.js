import { Pool } from 'pg';

class Model {
  constructor(table) {
    this.table = table;

    this.newUserColumns = 'email, first_name, last_name, password, type';
    this.newUserparams = '$1, $2, $3, $4, $5';

    this.newAccountColumns = 'account_number, owner, type, balance';
    this.newAccountparams = '$1, $2, $3, $4';

    this.newTransactionColumns = 'type, account_number, cashier, amount, old_balance, new_balance';
    this.newTransactionparams = '$1, $2, $3, $4, $5, $6';
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
      let columns;
      let parameters;
      if (this.table === 'users') {
        columns = this.newUserColumns;
        parameters = this.newUserparams;
      }
      if (this.table === 'accounts') {
        columns = this.newAccountColumns;
        parameters = this.newAccountparams;
      }
      if (this.table === 'transactions') {
        columns = this.newTransactionColumns;
        parameters = this.newTransactionparams;
      }
      const values = [...query];
      const sql = `insert into ${this.table} (${columns}) values(${parameters}) returning *`;
      const result = await this.pool.query(sql, values);
      return result.rows[0];
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
      const result = await this.pool.query(`select * from ${this.table} where ${column} = '${param}'`);
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * @description returns all the accounts
   * @static
   * @param {Object} column
   * @param {Object} param
   * @returns {Object}  row found
   * @memberof Model
   */
  async FindAllAccounts(secondTable) {
    try {
      const sql = `select accounts.account_number, accounts.type, accounts.created_on, accounts.status, accounts.balance, 
      users.email  from accounts inner join ${secondTable} on ${this.table}.owner = ${secondTable}.id`;
      const result = await this.pool.query(sql);
      return result.rows;
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
      const result = await this.pool.query(sql, values);
      return result.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description returns all account depending on the type
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async FindStatusAccount(status, secondTable) {
    try {
      const sql = `select accounts.account_number, accounts.type, accounts.created_on, accounts.status, accounts.balance, 
      users.email  from accounts inner join ${secondTable} on ${this.table}.owner = ${secondTable}.id where status = '${status}' `;
      const result = await this.pool.query(sql);
      return result.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description returns all account depending on the type
   * @static
   * @returns {Object}  row found
   * @memberof Model
   */
  async Update(column, columnCondition, columnParameter, conditionParameter) {
    const values = [columnParameter, conditionParameter];
    try {
      const sql = `update ${this.table} set ${column} = $1 where ${columnCondition} = $2`;
      const result = await this.pool.query(sql, values);
      return result.rows;
    } catch (error) {
      return error;
    }
  }
}

export default Model;
