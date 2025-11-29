
/** @type {import('jest').Config} */
module.exports = {
  // Define a localização dos seus arquivos de teste
  roots: ["<rootDir>/tests"],

  // Configurações de transformação para suportar JS/JSX/TS/TSX
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^../database.js$": "<rootDir>/pages/api/database.js"
  },

  // Backend não usa DOM, mas usamos jsdom para simular o ambiente de navegador para o frontend
  testEnvironment: "jsdom",

  // --- CONFIGURAÇÕES DE COBERTURA ---
  collectCoverage: true,
  coverageDirectory: "coverage",

  coverageReporters: ["lcov", "text", "clover"], 

  // Arquivos dos quais coletar cobertura:
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,jsx,ts,tsx}",
    "pages/api/**/*.{js,jsx,ts,tsx}",
    "src/utils/**/*.{js,jsx,ts,tsx}",
  ],
  
  coveragePathIgnorePatterns: [
    "/node_modules/", 
    "src/styles/containers/containers.ts" 
  ],

  // Limites globais de cobertura
  coverageThreshold: {
    global: {
      statements: 20, 
      branches: 20,
      functions: 5,
      lines: 20
    }
  }
};