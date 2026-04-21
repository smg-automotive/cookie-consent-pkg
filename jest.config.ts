export default {
  clearMocks: true,
  collectCoverage: false,
  errorOnDeprecated: true,
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  preset: 'ts-jest/presets/js-with-ts',
  restoreMocks: true,
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup/jestDomExpects.ts'],
  testEnvironment: 'jsdom',
};
