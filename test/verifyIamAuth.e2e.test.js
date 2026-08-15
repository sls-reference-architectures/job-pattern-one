import axios from 'axios';

// `axios.create()` gets its own interceptor stack, so this client does NOT
// pick up the SigV4 interceptor registered in signRequests.e2e.js — which is
// exactly what we want to assert the endpoints reject unsigned callers.
const unsignedClient = axios.create();

describe('When calling the API without a SigV4 signature', () => {
  const requestOptions = { validateStatus: () => true };

  it('should reject POST /jobs with a 403', async () => {
    // ARRANGE
    const url = `${process.env.API_URL}/jobs`;

    // ACT
    const { status } = await unsignedClient.post(url, {}, requestOptions);

    // ASSERT
    expect(status).toEqual(403);
  });

  it('should reject GET /jobs/{jobId} with a 403', async () => {
    // ARRANGE
    const url = `${process.env.API_URL}/jobs/abc`;

    // ACT
    const { status } = await unsignedClient.get(url, requestOptions);

    // ASSERT
    expect(status).toEqual(403);
  });
});
