const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  globalSetup: './test/common/jest.e2e.setup',
  setupFilesAfterEnv: [...baseConfig.setupFilesAfterEnv, './test/signRequests.e2e.js'],
  testTimeout: 450000,
};
