import chalk from 'chalk';
import mysql from 'mysql2/promise';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ifs } from './data-sources';

const db: Record<any, any> = {};

db.initialize = async (): Promise<DataSource> => {
  return await ifs.initialize();
};

db.execute = async (
  statement: string,
  binds = [],
  opts: Record<string, unknown>
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let conn;

    try {
      conn = await mysql.createConnection(opts);
      const result = await conn.execute(statement, binds);
      resolve(result);
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
