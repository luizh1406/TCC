export default {
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
    "^.+\\.ts?$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testEnvironment: "jsdom", // <-- mudar aqui
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,jsx,ts,tsx}"
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 70,
      functions: 75,
      lines: 75
    }
  }
};
