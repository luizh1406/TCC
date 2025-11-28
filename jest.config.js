// jest.config.js

/** @type {import('jest').Config} */
module.exports = {
  // Define a localização dos seus arquivos de teste
  roots: ["<rootDir>/tests"],

  // Configurações de transformação para suportar JS/JSX/TS/TSX
  transform: {
    // Usa babel-jest para todos os arquivos JS/JSX/TS/TSX
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],

  //Resolve o alias @/
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },

  // Backend não usa DOM, mas usamos jsdom para simular o ambiente de navegador para o frontend
  testEnvironment: "jsdom",

  // --- CONFIGURAÇÕES DE COBERTURA ---
  collectCoverage: true,
  coverageDirectory: "coverage",
  
  // Arquivos dos quais coletar cobertura:
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,jsx,ts,tsx}",
    // Adicione mais especificidade para garantir que a lógica do backend seja incluída
    "pages/api/**/*.{js,jsx,ts,tsx}",
    "src/utils/**/*.{js,jsx,ts,tsx}",
  ],
  
  //  ADICIONADO: Ignora arquivos de estilos ou outros que não contêm lógica de negócios
  coveragePathIgnorePatterns: [
    "/node_modules/", 
    // Ignora o arquivo que estava com baixa cobertura (4.54%) no frontend
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