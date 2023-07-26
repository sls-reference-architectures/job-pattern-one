import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import errorHandler from '@middy/http-error-handler';
import eventNormalizer from '@middy/http-event-normalizer';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const createJob = async (event) => {
  const { body } = event;
  const result = await service.createJob(body);

  return { statusCode: 201, body: JSON.stringify(result) };
};

export default middy(createJob)
  .use(jsonBodyParser())
  .use(eventNormalizer())
  .use(inputOutputLogger(ioLoggerConfig))
  .use(errorHandler());
