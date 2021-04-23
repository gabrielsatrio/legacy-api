import { ApolloServer } from 'apollo-server-express';
import chalk from 'chalk';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import { join } from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { redis } from './redis';
import { createUserLoader } from './utils/createUserLoader';

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
let server: http.Server | https.Server;

export default class apolloServer {
  static initialize = async (): Promise<void> => {
    const app = express();

    const RedisStore = connectRedis(session);

    app.use(
      cors({
        credentials: true,
        origin: process.env.FRONTEND_URL
      })
    );

    app.set('trust proxy', 1);

    app.use(
      session({
        store: new RedisStore({
          client: redis,
          disableTTL: true,
          disableTouch: true
        }),
        name: process.env.COOKIE_NAME,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: false, // use "isProd" as value, so that cookie can works for https only
          sameSite: 'lax', // csrf
          domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // 10 years
        }
      } as any)
    );

    app.use(
      helmet({
        contentSecurityPolicy: isProd ? undefined : false
      })
    );
    app.use(compression());

    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [join(__dirname, 'resolvers/**/!(*.d).{ts,js}')],
        authChecker: ({ context: { req } }) => !!req.session.userId,
        validate: true
      }),
      context: ({ req, res }) => ({
        req,
        res,
        userLoader: createUserLoader()
      }),
      uploads: false // disable apollo upload property
    });

    apolloServer.applyMiddleware({ app, cors: false });

    server = http.createServer(app);

    // Add subscription support
    apolloServer.installSubscriptionHandlers(server);

    server.listen(process.env.PORT, () =>
      console.log(
        chalk.red.bold('🚀 '),
        chalk.green.bold('Server ready at'),
        chalk.yellow.bold(
          `http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
        )
      )
    );
  };

  static close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      server.close((err: Error | null | undefined) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  };
}
