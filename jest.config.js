module.exports = {
  setupFilesAfterEnv: ['jest-extended/all'],
  transform: {
    '^.+\\.js?$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/?!@faker-js/faker'],
};
