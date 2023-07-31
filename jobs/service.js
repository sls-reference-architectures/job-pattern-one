import { ulid } from 'ulid';
import { KeyValueRepository } from '@setho/dynamodb-repository';

import calculateTimeToLive from '../common/calculateTimeToLive';
import getDynamoDbClient from '../common/dynamoDbClient';

const kvRepo = new KeyValueRepository({
  tableName: process.env.TABLE_NAME,
  keyName: 'id',
  idOptions: {
    prefix: 'JOB#',
  },
  documentClient: getDynamoDbClient(),
});

export const createJob = async ({ phrase, name }) => {
  const job = {
    id: ulid(),
    name,
    phrase,
    status: 'Pending',
    ttl: calculateTimeToLive({ numberOfDays: 5 }),
  };
  const result = await kvRepo.create(job);

  return result;
};

export const setStatus = async ({ job, status }) => {
  const updatedJob = { ...job, status };
  await kvRepo.update(updatedJob);
};
