import { join } from 'path';
import config from './src/config';

const { host, logging, password, port, sid, type, username } = config.db;

export = {
  type,
  host,
  port,
  username,
  password,
  sid,
  synchronize: false,
  logging,
  entities: [join(__dirname, 'src/entities/**/!(*.test).{ts,js}')],
  migrations: [join(__dirname, 'src/db/migrations/**/!(*.test).{ts,js}')],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/db/migrations'
  }
};
