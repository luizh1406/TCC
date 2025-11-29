// tests/backend/services.test.js

// Importa o handler a ser testado
import updateQuery from "../../pages/api/update/services.js";

// Mock do banco (Postgres)
// 🚨 ATENÇÃO: Use o caminho absoluto para o database.js a partir da raiz do teste.
// services.js está em pages/api/update/, então o DB está em pages/api/
import pool from "../../pages/api/database.js";
jest.mock("../../pages/api/database.js", () => ({
  query: jest.fn(),
}));

// Mock para os logs de console (essencial para cobertura do catch)
global.console = {
  table: jest.fn(),
  log: jest.fn(),
  error: jest.fn(),
};

describe('updateQuery Handler (services.js)', () => {
  const mockValidService = {
    id: 99, 
    codigo: 'S101', 
    descricao: 'Teste de Atualização',
    tempo: 5,
    valorunitario: 100.50,
    valortotal: 502.50,
  };
  
  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    pool.query.mockClear();
    global.console.log.mockClear();
    global.console.error.mockClear();
    global.console.table.mockClear();
  });
  
  // --- 1. SUCESSO (Caminho 200) ---
  it('deve responder com status 200 quando a atualização do serviço é bem-sucedida', async () => {
    const req = { method: 'POST', body: [mockValidService] };
    const res = mockResponse();
    pool.query.mockResolvedValue({ rowCount: 1 });

    await updateQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Serviço atualizado com sucesso.',
      rowsAffected: 1,
    });
  });
  
  // --- 2. FALHA LÓGICA (Caminho 404) ---
  it('deve retornar status 404 se o DB for chamado mas 0 linhas forem afetadas', async () => {
    const req = { method: 'POST', body: [mockValidService] };
    const res = mockResponse();
    pool.query.mockResolvedValue({ rowCount: 0 }); 

    await updateQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: expect.stringContaining("Nenhum serviço encontrado"),
    });
  });

  // --- 3. ERRO DE BANCO DE DADOS (Caminho 500) ---
  it('deve retornar status 500 se houver um erro no banco de dados (TRY/CATCH)', async () => {
    const req = { method: 'POST', body: [mockValidService] };
    const res = mockResponse();
    const dbError = new Error("Simulated DB Failure");

    const consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
    pool.query.mockRejectedValue(dbError);

    await updateQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Failed to update data",
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating data:", dbError);
    consoleErrorSpy.mockRestore();
  });

  // --- 4. MÉTODO NÃO PERMITIDO (Caminho 405) ---
  it('deve retornar status 405 se o método da requisição não for POST', async () => {
    const req = { method: 'GET' }; 
    const res = mockResponse();

    await updateQuery(req, res);

    expect(pool.query).not.toHaveBeenCalled(); 
    expect(res.status).toHaveBeenCalledWith(405);
  });
  
  // --- 5. CASO INVÁLIDO (TypeError) ---
  // Testa o cenário de body vazio, forçando o TypeError que não é tratado no código de produção
  it('deve lançar TypeError se o body for vazio', async () => {
    const res = mockResponse();
    const req = { method: 'POST', body: [] }; 
    
    await expect(updateQuery(req, res)).rejects.toThrow(
        /Cannot read properties of undefined/
    );
    expect(pool.query).not.toHaveBeenCalled(); 
  });
});