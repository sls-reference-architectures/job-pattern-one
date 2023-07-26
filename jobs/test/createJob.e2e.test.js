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
});
