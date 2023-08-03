import middy from '@middy/core';
import errorHandler from '@middy/http-error-handler';
import eventNormalizer from '@middy/http-event-normalizer';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const getJob = async (event) => {
  const {
    pathParameters: { jobId },
  } = event;
  const result = await service.getJob(jobId);

  return { statusCode: 200, body: JSON.stringify(result) };
};

export default middy(getJob)
  .use(eventNormalizer())
  .use(inputOutputLogger(ioLoggerConfig))
  .use(errorHandler());
