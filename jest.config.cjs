/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',             // diz pro Jest usar ts-jest
    testEnvironment: 'jest-environment-jsdom',      // necessário para testes React
    setupFiles: ['<rootDir>/jest.env.js'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // arquivo de setup (jest-dom)
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],    // transpila TS/TSX
    },
    moduleNameMapper: {
        '^@/config/__mocks__/api$': '<rootDir>/src/config/__mocks__/api.ts',
        '^@/(.*)$': '<rootDir>/src/$1', // <- mapeia o alias @ para src
    },
    roots: ['<rootDir>/src'], //mapeamento para o workflow
    testMatch: [
        '<rootDir>/src/__tests__/unit/**/*.[jt]s?(x)',
        '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
};
