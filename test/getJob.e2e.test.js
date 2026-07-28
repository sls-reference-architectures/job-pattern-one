import axios from 'axios';
import retry from 'async-retry';

import JobDbTestHelpers from './dbTestHelpers';

describe('When getting a Job', () => {
  const dbTestHelpers = new JobDbTestHelpers();

  afterAll(async () => {
    await dbTestHelpers.teardown();
  });

  it('should return 200', async () => {
    // ARRANGE
    const { id: jobId } = await dbTestHelpers.createRandomJobInDb();
    const requestOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    };

    await retry(
      async () => {
        // ACT
        const { status } = await axios.get(`/jobs/${jobId}`, requestOptions);

        // ASSERT
        expect(status).toEqual(200);
      },
      { retries: 3 },
    );
  });

  it('should return the newly-created Job', async () => {
    const job = await dbTestHelpers.createRandomJobInDb();
    const requestOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    };

    await retry(
      async () => {
        // ACT
        const { data: jobInDb } = await axios.get(`/jobs/${job.id}`, requestOptions);

        // ASSERT
        expect(jobInDb.name).toEqual(job.name);
        expect(jobInDb.phrase).toEqual(job.phrase);
        expect(jobInDb.id).toBeString();
      },
      { retries: 3 },
    );
  });

  describe('with no matching job', () => {
    it('should return 404', async () => {
      // ARRANGE
      const requestOptions = {
        baseURL: process.env.API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: () => true,
      };

      // ACT
      const { status } = await axios.get('/jobs/xyz', requestOptions);

      // ASSERT
      expect(status).toEqual(404);
    });
  });
});
