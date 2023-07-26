import axios from 'axios';

import { createRandomCreateJobInput } from './utils';

describe('When creating Job', () => {
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

    // ASSERT
    expect(job.name).toEqual(input.name);
    expect(job.phrase).toEqual(input.phrase);
    expect(job.id).toBeString();
    expect(job.status).toEqual('Pending');
  });
});
