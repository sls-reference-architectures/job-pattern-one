import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const setJobStatusFailed = async (event) => {
  const result = await service.setJobStatus({ job: event, status: 'Failed' });

  return result;
};

export default middy(setJobStatusFailed).use(inputOutputLogger(ioLoggerConfig));
