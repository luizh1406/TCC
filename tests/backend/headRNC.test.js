// Importa o handler a ser testado
import updateQuery from "../../pages/api/update/headRNC.js";

// Mock do banco (Postgres)
import pool from "../../pages/api/database.js";
jest.mock("../../pages/api/database.js", () => ({
  query: jest.fn(),
}));

// Mock para os logs de console (essencial para cobertura do catch)
global.console = {
  log: jest.fn(),
  error: jest.fn(),
};

describe('updateQuery Handler (headRNC.js)', () => {
  const mockValidData = {
    id: 101,
    nr_op: 'OP-2025',
    ns: 'NS-001',
    setor: 'Produção',
    data_ocorrencia: '2025-11-28',
    codigo_projeto: 'P-999',
    email: 'user@example.com',
    descricao: 'Teste de atualização',
  };

  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  beforeEach(() => {
    pool.query.mockClear();
    global.console.log.mockClear();
    global.console.error.mockClear();
  });
  
  // --- 1. SUCESSO (Caminho 200) ---
  it('deve responder com status 200 quando a atualização é bem-sucedida', async () => {
    const req = { method: 'POST', body: mockValidData };
    const res = mockResponse();
    pool.query.mockResolvedValue({ rowCount: 1 });

    await updateQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: expect.stringContaining('RNC ID 101 atualizada com sucesso.'),
      rowsAffected: 1,
    });
  });
  
  // --- 2. VALIDAÇÃO (Caminho 400) ---
  it('deve retornar status 400 se o corpo da requisição for nulo ou sem ID', async () => {
    let req = { method: 'POST', body: null }; 
    let res = mockResponse();

    await updateQuery(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    res = mockResponse();
    req = { method: 'POST', body: { nr_op: 'teste' } }; 
    await updateQuery(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
  // --- 3. NENHUMA LINHA AFETADA (Caminho 404) ---
  it('deve retornar status 404 se o ID existir, mas nenhuma linha for afetada', async () => {
    const req = { method: 'POST', body: mockValidData };
    const res = mockResponse();
    pool.query.mockResolvedValue({ rowCount: 0 });

    await updateQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // --- 4. ERRO DE BANCO DE DADOS (Caminho 500) ---
  it('deve retornar status 500 se houver um erro no banco de dados', async () => {
    const req = { method: 'POST', body: mockValidData };
    const res = mockResponse();
    const dbError = new Error("Simulated DB Failure");

    const consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
    pool.query.mockRejectedValue(dbError);

    await updateQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating data:", dbError);
    consoleErrorSpy.mockRestore();
  });

  // --- 5. MÉTODO NÃO PERMITIDO (Caminho 405) ---
  it('deve retornar status 405 se o método da requisição não for POST', async () => {
    const req = { method: 'GET' }; 
    const res = mockResponse();

    await updateQuery(req, res);

    expect(pool.query).not.toHaveBeenCalled(); 
    expect(res.status).toHaveBeenCalledWith(405);
  });
});