import { User } from '@/modules/__core__/entities/User';
import Chance from 'chance';
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
