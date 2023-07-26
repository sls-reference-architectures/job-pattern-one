/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';

export const createRandomCreateJobInput = (overrideWith) => {
  const createJobInput = {
    phrase: faker.lorem.sentence(),
    name: faker.person.fullName(),
  };

  return { ...createJobInput, ...overrideWith };
};

export const createRandomJob = (overrideWith) => {
  const job = {
    id: createTestId(),
    name: faker.person.fullName(),
    phrase: faker.lorem.sentence(),
  };

  return { ...job, ...overrideWith };
};

const createTestId = () => `TEST_${ulid()}`;
