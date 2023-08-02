import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const setJobStatusComplete = async (event) => {
  const result = await service.setJobStatus({ job: event, status: 'Complete' });

  return result;
};

export default middy(setJobStatusComplete).use(inputOutputLogger(ioLoggerConfig));
