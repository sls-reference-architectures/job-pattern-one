import { SFNClient } from '@aws-sdk/client-sfn';

let sfnClient;

const getSfnClient = () => {
  if (!sfnClient) {
    sfnClient = new SFNClient({ region: process.env.AWS_REGION });
  }

  return sfnClient;
};

export default getSfnClient;
