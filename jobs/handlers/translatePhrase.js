import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';
import * as service from '../service';

const translatePhrase = async (event) => {
  const { phrase } = event;
  const translatedPhrase = service.translatePhrase(phrase);

  return { ...event, translatedPhrase };
};

export default middy(translatePhrase).use(inputOutputLogger(ioLoggerConfig));
