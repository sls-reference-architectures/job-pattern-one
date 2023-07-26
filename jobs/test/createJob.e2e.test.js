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
    const input = { foo: 'bar' };

    // ACT
    const { data, status } = await axios.post('/jobs', input, requestOptions);
    // eslint-disable-next-line no-console
    console.log(data);

    // ASSERT
    expect(status).toEqual(201);
  });
});
