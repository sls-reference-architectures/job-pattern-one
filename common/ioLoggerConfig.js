import Logger from '@dazn/lambda-powertools-logger';

// Update this for middy's io logger configuration
const ioLoggerConfig = {
  awsContext: true,
  logger: (request) => {
    if (isJsonString(request?.body)) {

      request.response.body = JSON.parse(request.response.body); // eslint-disable-line no-param-reassign
    }
    Logger.debug('In I/O Logger', { request });
  },
};

// https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
};

export default ioLoggerConfig;
