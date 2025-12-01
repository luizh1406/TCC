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
    "pages/**/*.{js,jsx,ts,tsx}",
    "src/**/*.{js,jsx,ts,tsx}",
  ],

  // ❌ Removemos backend e frontend daqui
  testPathIgnorePatterns: [
    "/node_modules/",
  ],
};
