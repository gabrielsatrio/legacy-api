import config from '@/config/main';
import { join } from 'path';

const { host, logging, password, port, sid, type, username } = config.db;
const sourcePath = config.env === 'production' ? 'dist/src' : 'src';

export = {
  type,
  host,
  port,
  username,
  password,
  sid,
  synchronize: false,
  logging,
  entities: [
    join(__dirname, sourcePath, 'features/**/entities/!(*.test).{ts,js}')
  ],
  migrations: [
    join(__dirname, sourcePath, 'database/migrations/**/!(*.test).{ts,js}')
  ]
};
