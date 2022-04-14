import chalk from 'chalk';
import oracledb from 'oracledb';
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

    opts.outFormat = oracledb.DB_TYPE_OBJECT;
    opts.autoCommit = true;

    try {
      conn = await oracledb.getConnection();
      const result = await conn.execute(statement, binds, opts);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (error) {
          console.error(chalk.red(error));
        }
      }
    }
  });
};

export default db;
