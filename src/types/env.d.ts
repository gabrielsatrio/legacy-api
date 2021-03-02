declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_SID: string;
    DATABASE_LOGGING: string;
    REDIS_URL: string;
    FRONTEND_URL: string;
    COOKIE_NAME: string;
    COOKIE_DOMAIN: string;
    SESSION_SECRET: string;
    FORGET_PASSWORD_PREFIX: string;
  }
}
