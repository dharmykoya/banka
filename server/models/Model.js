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
      const sql = `insert into ${this.table} (email, first_name, last_name, password, type, admin) values($1, $2, $3, $4, $5, $6) returning *`;
      const res = await this.pool.query(sql, values);
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
  async FindOne(column, param) {
    try {
      const res = await this.pool.query(`select * from ${this.table} where ${column} = ${param}`);
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
      console.log(121, res.rows[0]);
      return res.rows[0];
    } catch (error) {
      return error;
    }
  }
}

export default Model;
