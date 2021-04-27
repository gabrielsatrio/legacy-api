import dotenvFlow from 'dotenv-flow';

const envFound = dotenvFlow.config();

if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  client: {
    url: process.env.FRONTEND_URL
  },
  cookie: {
    domain: process.env.COOKIE_DOMAIN,
    name: process.env.COOKIE_NAME
  },
  env: process.env.NODE_ENV || 'development',
  redis: {
    url: process.env.REDIS_URL
  },
  server: {
    port: process.env.PORT
  },
  session: {
    secret: process.env.SESSION_SECRET
  },
  token: {
    prefix: process.env.FORGET_PASSWORD_PREFIX
  }
};
