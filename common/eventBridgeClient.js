import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

const options = {
  region: process.env.AWS_REGION,
};

let client = null;

const getEventBridgeClient = () => {
  if (!client) {
    client = new EventBridgeClient(options);
  }

  return client;
};

export default getEventBridgeClient;
