import path from 'path';
import 'reflect-metadata';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export const initializeDatabase = async (
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

export default initializeDatabase;
