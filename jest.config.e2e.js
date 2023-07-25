const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  globalSetup: './common/jest.e2e.setup',
  testTimeout: 450000,
};
