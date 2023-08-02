import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const onJobCreated = async (event) => {
  const {
    detail: { id: jobId, phrase, name },
  } = event;
  await service.startStateMachine({ jobId, phrase, name });
};

export default middy(onJobCreated).use(inputOutputLogger(ioLoggerConfig));
