// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const fs = require('fs-extra');

module.exports = {
    projects: [
        {
            displayName: 'lint',
            runner: 'eslint',
            rootDir: process.cwd(),
            roots: ['<rootDir>/packages', fs.existsSync(process.cwd() + '/tests') && '<rootDir>/tests'].filter(Boolean),
            testMatch: [
                '<rootDir>/packages/**/__tests__/**/*.{js,jsx,ts,tsx}',
                '<rootDir>/{packages,tests}/**/*.{spec,test}.{js,jsx,ts,tsx}'
            ]
        },
        {
            displayName: 'test',
            rootDir: process.cwd(),
            roots: ['<rootDir>/packages', fs.existsSync(process.cwd() + '/tests') && '<rootDir>/tests'].filter(Boolean),
            collectCoverageFrom: ['packages/**/*.{js,jsx,ts,tsx}', '!packages/**/*.d.ts'],
            setupFiles: [],
            setupFilesAfterEnv: ['<rootDir>/jest/setupTests.ts'],
            testMatch: [
                '<rootDir>/packages/**/__tests__/**/*.{js,jsx,ts,tsx}',
                '<rootDir>/{packages,tests}/**/*.{spec,test}.{js,jsx,ts,tsx}'
            ],
            testEnvironment: 'jsdom',
            transform: {
                '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
                '^.+\\.(css|less|sass|scss$)': '<rootDir>/jest/cssTransform.js',
                '^(?!.*\\.(js|jsx|ts|tsx|css|less|sass|scss|json)$)': '<rootDir>/jest/fileTransform.js'
            },
            transformIgnorePatterns: [
                '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
                '^.+\\.module\\.(css|sass|scss|less)$'
            ],
            modulePaths: [],
            moduleNameMapper: {
                '^react-native$': 'react-native-web',
                '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
            },
            moduleFileExtensions: ['web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'],
            verbose: true,
            // resetMocks: true,
            watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname']
        }
    ]
};
