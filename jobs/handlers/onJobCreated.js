import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const onJobCreated = async (event) => {
  const { detail: job } = event;
  await service.startStateMachine(job);
};

export default middy(onJobCreated).use(inputOutputLogger(ioLoggerConfig));
