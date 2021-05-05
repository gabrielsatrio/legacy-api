import chalk from 'chalk';
import oracledb from 'oracledb';
import path from 'path';
import 'reflect-metadata';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

const db: Record<any, any> = {};

db.initialize = async (
  optionOverrides: Record<string, any> = {}
): Promise<Connection> => {
  const connectionOptions = await getConnectionOptions();
  const options: any = {
    ...connectionOptions,
    entities: [path.join(__dirname, '../entities/**/*.ts')],
    migrations: [path.join(__dirname, './migrations/*.ts')],
    ...optionOverrides
  };

  const connection = await createConnection(options);

  return connection;
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
