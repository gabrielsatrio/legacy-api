/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('@/config/main');
const { join } = require('path');

const {
  env,
  db: { host, logging, password, port, sid, type, username }
} = config.default;
const sourcePath = env === 'production' || env === 'testing' ? '.' : 'src';

module.exports = {
  type,
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
};
