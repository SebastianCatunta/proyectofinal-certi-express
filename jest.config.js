export default {
    testEnvironment: "node",
    transform: {},
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    collectCoverageFrom: [
        "src/controllers/**/*.js",
        "src/services/**/*.js",
        "src/middlewares/**/*.js",
        "src/routes/**/*.js"
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"]
};