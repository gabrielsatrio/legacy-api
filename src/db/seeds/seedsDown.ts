import initializeDatabase from '../initializeDatabase';
import { userFactory } from './../factories/userFactory';

const run = async (): Promise<any> => {
  console.log('Connecting to DB');
  const connection = await initializeDatabase({ migrationsRun: false });

  console.log('Truncate all tables');
  await userFactory.deleteAll();

  console.log('Closing DB');
  return await connection.close();
};

run();
