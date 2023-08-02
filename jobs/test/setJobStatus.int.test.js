import { faker } from '@faker-js/faker';
import retry from 'async-retry';

import * as service from '../service';
import JobDbTestHelpers from './dbTestHelpers';

describe('When setting job status', () => {
  const jobDbTestHelpers = new JobDbTestHelpers();
  afterAll(async () => {
    await jobDbTestHelpers.teardown();
  });

  it('should update status in DB', async () => {
    // ARRANGE
    const job = await jobDbTestHelpers.createRandomJobInDb();
    const newStatus = faker.lorem.slug();

    // ACT
    await retry(async () => service.setJobStatus({ job, status: newStatus }), { retries: 3 });

    // ASSERT
    await retry(
      async () => {
        const jobInDb = await jobDbTestHelpers.getJob(job.id);
        expect(jobInDb.status).toEqual(newStatus);
      },
      { retries: 3 },
    );
  });
});
