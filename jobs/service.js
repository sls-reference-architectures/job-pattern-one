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

export const startStateMachine = async ({ jobId, phrase, name }) => {
  const executionName = `${jobId}-${new Date().getTime()}`;
  const command = new StartExecutionCommand({
    input: JSON.stringify({ jobId, phrase, name }),
    name: executionName,
    stateMachineArn: process.env.TRANSLATE_STATE_MACHINE_ARN,
  });
  const sfnClient = getSfnClient();
  const response = await sfnClient.send(command);

  return response;
};
