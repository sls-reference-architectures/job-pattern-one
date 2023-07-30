import axios from 'axios';
import retry from 'async-retry';

import { createRandomCreateJobInput } from './staticTestHelpers';
import JobDbTestHelpers from './dbTestHelpers';

describe('When creating a Job', () => {
  const dbTestHelpers = new JobDbTestHelpers();

  afterAll(async () => {
    await dbTestHelpers.teardown();
  });

  it('should return 201', async () => {
    // ARRANGE
    const requestOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    };
    const input = createRandomCreateJobInput();

    // ACT
    const { status } = await axios.post('/jobs', input, requestOptions);

    // ASSERT
    expect(status).toEqual(201);
  });

  it('should return the newly-created Job', async () => {
    // ARRANGE
    const requestOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const input = createRandomCreateJobInput();

    // ACT
    const { data: job } = await axios.post('/jobs', input, requestOptions);
    dbTestHelpers.trackForTeardown(job.id);

    // ASSERT
    expect(job.name).toEqual(input.name);
    expect(job.phrase).toEqual(input.phrase);
    expect(job.id).toBeString();
    expect(job.status).toEqual('Pending');
  });

  it('should save the job in the DB', async () => {
    // ARRANGE
    const requestOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const input = createRandomCreateJobInput();

    // ACT
    const { data: job } = await axios.post('/jobs', input, requestOptions);
    dbTestHelpers.trackForTeardown(job.id);

    // ASSERT
    await retry(
      async () => {
        const jobInDb = await dbTestHelpers.getJob(job.id);
        expect(jobInDb.phrase).toEqual(job.phrase);
      },
      { retries: 3 },
    );
  });
});
