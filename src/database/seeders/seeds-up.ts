import db from '..';
import { userSeeds } from './user.seed';

const seed = async (): Promise<any> => {
  await userSeeds();
};

const run = async (): Promise<any> => {
  console.log('Connecting to DB');
  const connection = await db.initialize({ migrationsRun: false });

  console.log('Seeding DB');
  await seed();

  console.log('Closing DB');
  return await connection.close();
};

run();
