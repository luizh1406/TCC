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
      statements: 20,
      branches: 20,
      functions: 5,
      lines: 20
    }
  }
};
