import axios from 'axios';
import retry from 'async-retry';
import { SFNClient, StartSyncExecutionCommand } from '@aws-sdk/client-sfn';

import { createRandomCreateJobInput } from './staticTestHelpers';
import JobDbTestHelpers from './dbTestHelpers';

describe('When the job-created event is delivered twice', () => {
  const dbTestHelpers = new JobDbTestHelpers();
  const sfn = new SFNClient({ region: process.env.AWS_REGION });

  afterAll(async () => {
    await dbTestHelpers.teardown();
  });

  it('should leave the completed job untouched', async () => {
    // ARRANGE
    const requestOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data: createdJob } = await axios.post(
      '/jobs',
      createRandomCreateJobInput(),
      requestOptions,
    );
    dbTestHelpers.trackForTeardown(createdJob.id);
    const completedJob = await retry(
      async () => {
        const jobInDb = await dbTestHelpers.getJob(createdJob.id);
        expect(jobInDb.status).toEqual('Complete');
        return jobInDb;
      },
      { retries: 5 },
    );

    // ACT
    const { status, error } = await sfn.send(
      new StartSyncExecutionCommand({
        stateMachineArn: process.env.STATE_MACHINE_ARN,
        input: JSON.stringify(createdJob),
      }),
    );

    // ASSERT
    expect({ status, error }).toEqual({ status: 'SUCCEEDED', error: undefined });
    const jobAfterRedelivery = await dbTestHelpers.getJob(createdJob.id);
    expect(jobAfterRedelivery).toEqual(completedJob);
  });
});
