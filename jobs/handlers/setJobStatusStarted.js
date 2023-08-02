import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const setJobStatusStarted = async (event) => {
  const result = await service.setJobStatus({ job: event, status: 'Started' });

  return result;
};

export default middy(setJobStatusStarted).use(inputOutputLogger(ioLoggerConfig));
