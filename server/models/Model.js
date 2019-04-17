import { Pool } from 'pg';

class Model {
  constructor(table) {
    this.table = table;
    this.pool = Model.initConn();
    this.pool.on('error', err => err);
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
      this.logJSON(error);
      return error;
    }
  }

  static initConn() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    return pool;
  }
}

export default Model;
