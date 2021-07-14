import chalk from 'chalk';
import 'module-alias/register'; // eslint-disable-line
import { createConnection } from 'typeorm';
import config from './configs/main';
import apolloServer from './providers/server';

const startup = async () => {
  console.log(chalk.blue.bold('Starting server...\n'));

  try {
    console.log('Initializing database connection...');
    await createConnection();
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

if (config.env === 'production') {
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
