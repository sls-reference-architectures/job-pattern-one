import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const setJobStatusStarted = async (event) => {
  const { detail: job } = event;
  await service.setJobStatus({ job, status: 'Started' });
};

export default middy(setJobStatusStarted).use(inputOutputLogger(ioLoggerConfig));
