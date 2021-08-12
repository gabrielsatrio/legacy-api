import db from '..';
import { userFactory } from '../factories/user.factory';

const run = async (): Promise<any> => {
  console.log('Connecting to DB');
  const connection = await db.initialize({ migrationsRun: false });

  console.log('Truncate all tables');
  await userFactory.deleteAll();

  console.log('Closing DB');
  return await connection.close();
};

run();
