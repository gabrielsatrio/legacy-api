/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('@/config/main');
const { join } = require('path');

const {
  host,
  logging,
  password,
  port,
  sid,
  type,
  username
} = config.default.db;
const sourcePath = config.default.env === 'production' ? '.' : 'src';

module.exports = {
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
