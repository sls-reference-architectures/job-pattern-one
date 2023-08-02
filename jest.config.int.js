const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  globalSetup: './common/jest.int.setup',
  testTimeout: 60000,
};
