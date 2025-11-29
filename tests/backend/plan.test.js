
// Importa o handler a ser testado. Assumindo que plan.js está em pages/api/update/
import updateQuery from "../../pages/api/update/plan.js";

// Mock do banco (Postgres)
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

describe('updateQuery Handler (plan.js)', () => {
  const mockPlanoData = {
    id: 5,
    codigo: 'PA-005',
    descricao: 'Ajuste de Fluxo',
    ativo: true,
    solucao: 'Implementação de novo processo de inspeção.',
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
  it('deve responder com status 200 quando a atualização do plano de ação é bem-sucedida', async () => {
    // O corpo da requisição é um array contendo o objeto do plano
    const req = { method: 'POST', body: [mockPlanoData] }; 
    const res = mockResponse();
    pool.query.mockResolvedValue({ rowCount: 1 });

    await updateQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Plano de ação ID 5 atualizado com sucesso.',
      rowsAffected: 1,
    });
    // Verifica se a função console.table foi chamada com os dados
    expect(global.console.table).toHaveBeenCalledWith(mockPlanoData); 
  });
  
  // --- 2. NENHUMA LINHA AFETADA (Caminho 404) ---
  it('deve retornar status 404 se o DB for chamado mas 0 linhas forem afetadas', async () => {
    const req = { method: 'POST', body: [mockPlanoData] };
    const res = mockResponse();
    pool.query.mockResolvedValue({ rowCount: 0 }); 

    await updateQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: expect.stringContaining("Nenhum plano de ação encontrado"),
    });
    expect(global.console.log).toHaveBeenCalledWith("Aviso: Nenhuma linha atualizada.");
  });

  // --- 3. ERRO DE BANCO DE DADOS (Caminho 500) ---
  it('deve retornar status 500 se houver um erro no banco de dados (TRY/CATCH)', async () => {
    const req = { method: 'POST', body: [mockPlanoData] };
    const res = mockResponse();
    const dbError = new Error("Simulated DB Failure");

    // Espiona e simula a função console.error para cobrir a linha 55
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
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Method not allowed",
    });
  });
  
  // --- 5. CASO INVÁLIDO (TypeError - Falha de Validação) ---
  // Testa o cenário onde request.body é vazio ([]), forçando o TypeError ao tentar acessar [0]
  it('deve lançar TypeError se o body for um array vazio, pois a validação é ausente', async () => {
    const res = mockResponse();
    const req = { method: 'POST', body: [] }; 
    
    // O código de produção (planoData = request.body[0]) irá lançar TypeError
    await expect(updateQuery(req, res)).rejects.toThrow(
        /Cannot read properties of undefined/
    );
    expect(pool.query).not.toHaveBeenCalled(); 
  });
});