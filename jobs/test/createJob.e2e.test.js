import axios from 'axios';

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
    const input = { phrase: 'foo', name: 'Smith' };

    // ACT
    const { status } = await axios.post('/jobs', input, requestOptions);

    // ASSERT
    expect(status).toEqual(201);
  });
});
