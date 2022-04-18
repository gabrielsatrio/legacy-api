import { User } from '@/modules/core/entities/user';
import Chance from 'chance';
import { ifs } from '../data-sources';

const chance = new Chance();

export const userFactory = {
  build: (attrs: Partial<User> = {}): User => {
    const userAttrs: Partial<User> = {
      email: chance.email({ domain: 'example.com' }),
      ...attrs
    };
    return ifs.getRepository(User).create(userAttrs);
  },

  create: async (attrs: Partial<User> = {}): Promise<User> => {
    const user = userFactory.build(attrs);
    const createdUser = await ifs.getRepository(User).save(user);
    return createdUser;
  },

  deleteAll: async (): Promise<void> =>
    await ifs.getRepository(User).query('TRUNCATE "USER" CASCADE')
};
