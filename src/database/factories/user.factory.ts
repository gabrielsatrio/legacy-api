import Chance from 'chance';
import { User } from 'src/modules/core/entities/User';
import { getRepository } from 'typeorm';

const chance = new Chance();

export const userFactory = {
  build: (attrs: Partial<User> = {}): User => {
    const userAttrs: Partial<User> = {
      email: chance.email({ domain: 'example.com' }),
      ...attrs
    };
    return getRepository(User).create(userAttrs);
  },

  create: async (attrs: Partial<User> = {}): Promise<User> => {
    const user = userFactory.build(attrs);
    const createdUser = await getRepository(User).save(user);
    return createdUser;
  },

  deleteAll: async (): Promise<void> =>
    await getRepository(User).query('TRUNCATE "USER" CASCADE')
};
