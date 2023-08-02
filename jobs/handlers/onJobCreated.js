import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const onJobCreated = async (event) => {
  const { detail: job } = event;
  const updatedJob = await service.startStateMachine(job);

  return updatedJob;
};

export default middy(onJobCreated).use(inputOutputLogger(ioLoggerConfig));
