import mysql from 'mysql2/promise';
import config from '../../config/env';

let pool: mysql.Pool | undefined;

export const initDb = async (): Promise<mysql.Pool> => {
  if (!pool) {
    pool = await mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10
    });
  }
  return pool;
};

export const getPool = (): mysql.Pool => {
  if (!pool) throw new Error('DB not initialized');
  return pool;
};
