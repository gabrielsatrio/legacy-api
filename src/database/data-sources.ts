import { join } from 'path';
import { DataSource } from 'typeorm';
import config from '../config/main';

const {
  env,
  deploy,
  db: { host, logging, password, port, sid, username }
} = config;
const sourcePath = env === 'development' && !deploy ? 'src/../..' : './..';

export const ifs = new DataSource({
  type: 'oracle',
  host,
  port,
  username,
  password,
  sid,
  synchronize: false,
  logging,
  connectString: `${host}:${port}/${sid}`,
  entities: [
    join(__dirname, sourcePath, 'modules/**/entities/!(*.test).{ts,js}')
  ],
  migrations: [
    join(__dirname, sourcePath, 'database/migrations/**/!(*.test).{ts,js}')
  ]
});
