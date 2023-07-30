import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import getEventBridgeClient from '../../common/eventBridgeClient';
import EventBridgeDynamoDbStreamPublisher from '../../common/eventBridgeDynamoDbStreamPublisher';
import ioLoggerConfig from '../../common/ioLoggerConfig';

const publisher = new EventBridgeDynamoDbStreamPublisher({
  eventBusName: process.env.EVENT_BUS_NAME,
  eventBridgeClient: getEventBridgeClient(),
});

const publishDbEvents = async (event) => {
  await publisher.publish(event);
};

export default middy(publishDbEvents).use(inputOutputLogger(ioLoggerConfig));
