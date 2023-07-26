import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import inputOutputLogger from '@middy/input-output-logger';
import ioLoggerConfig from '../../common/ioLoggerConfig';

const saveJob = async (event) => {
  const result = { statusCode: 201, body: JSON.stringify(event) };

  return result;
};

export default middy(saveJob).use(inputOutputLogger(ioLoggerConfig)).use(httpErrorHandler());
