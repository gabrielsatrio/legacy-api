import { join } from 'path';
import { DataSource } from 'typeorm';
import config from '../config/main';

const {
  env,
  deploy,
  db: { host, database, password, port, username }
} = config;
const sourcePath = env === 'development' && !deploy ? 'src/../..' : './..';

export const ifs = new DataSource({
  type: 'mysql',
  host,
  database,
  port,
  username,
  password,
  entities: [
    join(__dirname, sourcePath, 'modules/**/entities/!(*.test).{ts,js}')
  ],
  migrations: [
    join(__dirname, sourcePath, 'database/migrations/**/!(*.test).{ts,js}')
  ]
});
