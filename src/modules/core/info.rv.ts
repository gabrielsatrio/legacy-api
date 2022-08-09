import config from '@/config/main';
import { mapError } from '@/utils/map-error';
import { Query, Resolver } from 'type-graphql';

const {
  db: { host }
} = config;

@Resolver()
export class InfoResolver {
  @Query(() => Boolean)
  isConnectToTestEnv(): boolean {
    try {
      return typeof host === 'string' && host.substring(0, 8) === 'api-test'
        ? true
        : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
