import argon2 from 'argon2';
import Chance from 'chance';
import { userFactory } from '../factories/user.factory';

const chance = new Chance();

export const userSeeds = async (): Promise<any> => {
  const users = [];
  let firstName;
  let lastName;
  let username;

  const admin = {
    username: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    password: await argon2.hash('123456'),
    email: 'john.doe@example.com',
    role: 'ADMIN',
    defaultSite: '*',
    defaultDept: '*'
  };

  firstName = chance.first();
  lastName = chance.last();
  username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;

  const editor = {
    username,
    firstName,
    lastName,
    password: await argon2.hash('123456'),
    email: chance.email({ domain: 'example.com' }),
    role: 'EDITOR',
    defaultSite: '*',
    defaultDept: '*'
  };

  firstName = chance.first();
  lastName = chance.last();
  username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;

  const viewer = {
    username,
    firstName,
    lastName,
    password: await argon2.hash('123456'),
    email: chance.email({ domain: 'example.com' }),
    role: 'VIEWER',
    defaultSite: '*',
    defaultDept: '*'
  };

  users.push(admin, editor, viewer);

  try {
    console.log('Seeding dummy user data...');
    const usersPromises = users.map((user) => userFactory.create(user));

    console.log(usersPromises);

    const userResults = await Promise.all(usersPromises);
    console.log('Done seeding users.');

    return userResults;
  } catch (err) {
    console.error('ERROR - Users: ', err);
  }
};
