module.exports = {
  roots: ["<rootDir>/tests"],

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  testEnvironment: "jsdom",

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "clover"], // 'lcov' é o que o Sonar precisa

  collectCoverageFrom: [
    "pages/**/*.{js,jsx,ts,tsx}",
    "src/**/*.{js,jsx,ts,tsx}",
  ],

  testPathIgnorePatterns: [
    "/node_modules/",
  ],
};