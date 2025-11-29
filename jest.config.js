/** @type {import('jest').Config} */
module.exports = {
  
  // 1. Definição da Raiz do Projeto (CORREÇÃO IMPLÍCITA)
  // O Jest infere a raiz como o diretório onde este arquivo está.
  // Não precisamos definir 'rootDir', mas é crucial garantir que a cobertura
  // comece a partir daqui.

  // Define a localização dos seus arquivos de teste
  // **REMOVIDO:** roots: ["<rootDir>/tests"],
  // **MOTIVO:** Se os seus testes estão em 'tests/', use 'testMatch' ou 'testRegex'.
  // Se 'roots' for usado assim, ele limita onde o Jest procura e pode confundir o
  // mapeamento de caminhos. Se você não tem problemas em encontrar os testes,
  // remova ou use apenas:
  roots: ["<rootDir>"],
  testMatch: ["<rootDir>/tests/**/*.js", "<rootDir>/tests/**/*.jsx"],
  
  // Configurações de transformação para suportar JS/JSX/TS/TSX
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],

  // Resolve o alias @/ E O CAMINHO RELATIVO DO BANCO DE DADOS
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^../database.js$": "<rootDir>/pages/api/database.js"
  },

  // Backend não usa DOM, mas usamos jsdom para simular o ambiente de navegador para o frontend
  testEnvironment: "jsdom",

  // --- CONFIGURAÇÕES DE COBERTURA (CORRIGIDAS) ---
  collectCoverage: true,
  coverageDirectory: "coverage",

  // 2. USO DO PROVIDER V8 (CORREÇÃO MAIS IMPORTANTE)
  // O V8 lida melhor com o mapeamento de caminhos relativos em CI/CD.
  coverageProvider: 'v8', 

  // ESSENCIAL PARA O SONARQUBE: Gera o arquivo lcov.info
  coverageReporters: ["lcov", "text", "clover"],

  // Arquivos dos quais coletar cobertura:
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,jsx,ts,tsx}",
    "pages/api/**/*.{js,jsx,ts,tsx}",
    "src/utils/**/*.{js,jsx,ts,tsx}",
  ],
  
  // ADICIONADO: Ignora arquivos de estilos ou outros que não contêm lógica de negócios
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