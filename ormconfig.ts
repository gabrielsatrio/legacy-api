import config from '@/configs/main';
import { join } from 'path';

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
  entities: [join(__dirname, 'src/features/**/entities/!(*.test).{ts,js}')],
  migrations: [join(__dirname, 'src/database/migrations/**/!(*.test).{ts,js}')]
};
