module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/test', '<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
};
