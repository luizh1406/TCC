module.exports = {
  roots: ["<rootDir>/tests"],

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  testEnvironment: "jsdom",

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "clover"],

  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/.next/**",
    "!coverage/**",
  ],

  coveragePathIgnorePatterns: [
    "/node_modules/",
  ],
};
