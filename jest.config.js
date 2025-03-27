// jest.config.js
module.exports = {
    preset: 'ts-jest', // Si vous utilisez TypeScript
    testEnvironment: 'node', // L'environnement de test (node, jsdom, etc.)
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '^src/domain/(.*)$': '<rootDir>/src/domain/$1',
      // Ajoutez d'autres mappages si nécessaire
    },
    // Ajoutez d'autres configurations Jest si nécessaire
  };