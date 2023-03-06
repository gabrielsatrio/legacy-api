import chalk from 'chalk';
import { mysql } from 'mysql';
import { env } from 'process';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ifs } from './data-sources';

const db: Record<any, any> = {};

db.initialize = async (): Promise<DataSource> => {
  return await ifs.initialize();
};

db.execute = async (): Promise<any> => {
  return new Promise(async (reject) => {
    let conn;

    try {
      conn = await mysql.createConnection({
        host: env.DATABASE_HOST,
        username: env.DATABASE_USERNAME,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_NAME
      });
      conn.connect((err) => {
        if (err) throw err;
        console.log('Connected!');
      });
    } catch (error) {
      reject(error);
    } finally {
      if (conn) {
        try {
          await conn.end();
        } catch (error) {
          console.error(chalk.red(error));
        }
      }
    }
  });
};

export default db;
