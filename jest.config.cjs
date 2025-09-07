/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',             // diz pro Jest usar ts-jest
    testEnvironment: 'jest-environment-jsdom',      // necessário para testes React
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // arquivo de setup (jest-dom)
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],    // transpila TS/TSX
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // <- mapeia o alias @ para src
    },
};
