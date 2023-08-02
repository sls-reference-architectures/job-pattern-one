import { ulid } from 'ulid';
import { KeyValueRepository } from '@setho/dynamodb-repository';
import { StartExecutionCommand } from '@aws-sdk/client-sfn';

import calculateTimeToLive from '../common/calculateTimeToLive';
import getDynamoDbClient from '../common/dynamoDbClient';
import getSfnClient from '../common/stepFunctionClient';

const kvRepo = new KeyValueRepository({
  tableName: process.env.TABLE_NAME,
  keyName: 'id',
  idOptions: {
    prefix: 'JOB_',
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

export const setJobStatus = async ({ job, status }) => {
  const updatedJob = { ...job, status };
  await kvRepo.update(updatedJob);
};

export const startStateMachine = async (job) => {
  const executionName = `${job.id}-${new Date().getTime()}`;
  const command = new StartExecutionCommand({
    input: JSON.stringify(job),
    name: executionName,
    stateMachineArn: process.env.TRANSLATE_STATE_MACHINE_ARN,
  });
  const sfnClient = getSfnClient();
  const response = await sfnClient.send(command);

  return response;
};

export const translatePhrase = (phrase = '') => {
  // In a real app, this could be a language translate or OCR or whatever. For now, it's a reverse.
  const reversed = phrase.split('').reverse().join('');

  return reversed;
};
