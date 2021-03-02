import chalk from 'chalk';
import dotenvFlow from 'dotenv-flow';
import { join } from 'path';
import { createConnection } from 'typeorm';
import apolloServer from './server';

dotenvFlow.config();

const startup = async () => {
  console.log(chalk.blue.bold('Starting server...\n'));

  try {
    console.log('Initializing database connection...');
    await createConnection({
      type: 'oracle',
      host: process.env.DATABASE_HOST,
      port:
        typeof process.env.DATABASE_PORT === 'number'
          ? +process.env.PORT
          : 1521,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      sid: process.env.DATABASE_SID,
      synchronize: false,
      logging: process.env.DATABASE_LOGGING === 'true' ? true : false,
      entities: [join(__dirname, 'entities/**/!(*.test).{ts,js}')],
      migrations: [join(__dirname, 'db/migrations/**/!(*.test).{ts,js}')],
      cli: {
        entitiesDir: join(__dirname, 'entities'),
        migrationsDir: join(__dirname, 'db/migrations')
      }
    });
    console.log('Initializing Apollo server...');
    await apolloServer.initialize();
  } catch (error) {
    console.error(chalk.red(error));
    process.exit(1); // Non-zero failure code
  }
};

startup().catch((err) => {
  console.error(err);
});

const shutdown = async (
  error?: Error | Record<string, unknown> | null | undefined
) => {
  let err = error;

  console.log(chalk.red.bold('\nShutting down\n'));

  try {
    console.log(`Closing Apollo server ${chalk.green('✓')}`);
    await apolloServer.close();
  } catch (error) {
    console.log(
      `Encountered error ${chalk.red(error)} when trying to close Apollo server`
    );
    err = err || error;
  }

  console.log(chalk.blue.bold('Exiting process'));

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
};

if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', () => {
    console.log(`Received SIGTERM ${chalk.green('✓')}`);
    shutdown();
  });

  process.on('SIGINT', () => {
    console.log(`Received SIGINT ${chalk.green('✓')}`);
    shutdown();
  });

  process.on('uncaughtException', (err) => {
    console.log(chalk.red('Uncaught exception'));
    console.error(err);
    shutdown(err);
  });

  process.on('unhandledRejection', (err) => {
    console.log(chalk.red('Uncaught rejection'));
    console.error(err);
    shutdown(err);
  });
}
