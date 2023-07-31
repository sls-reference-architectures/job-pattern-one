import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

import ioLoggerConfig from '../../common/ioLoggerConfig';

const onJobCreated = async (event) => {
  const ph = { ...event };

  return ph;
};

export default middy(onJobCreated).use(inputOutputLogger(ioLoggerConfig));
