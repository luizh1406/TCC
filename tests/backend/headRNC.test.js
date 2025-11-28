// headRNC.test.js

// Importa a função que será testada
import updateQuery from "../../pages/api/update/headRNC.js";

// 🚨 MOCK SINCRONIZADO: Agora este caminho DEVE corresponder ao usado em headRNC.js
const mockQuery = jest.fn();

jest.mock("../../pages/api/database.js", () => ({
  // Simula que o módulo exporta POR PADRÃO (default) um objeto que tem o método 'query'
  default: {
    query: mockQuery,
  },
}));

// Mock para os logs de console (essencial para cobrir logs de erro e sucesso)
global.console = {
  log: jest.fn(),
  error: jest.fn(),
};

describe('updateQuery Handler (headRNC.js)', () => {
  // Dados de sucesso que usaremos na maioria dos testes
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

  // Funções mockadas para simular a resposta HTTP (response)
  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    mockQuery.mockClear();
    global.console.log.mockClear();
    global.console.error.mockClear();
  });
  
  // --- TESTES DE SUCESSO (Caminho principal) ---

  it('deve responder com status 200 quando a atualização é bem-sucedida', async () => {
    const req = { method: 'POST', body: mockValidData };
    const res = mockResponse();

    // Configura o mock do DB para simular um sucesso (1 linha afetada)
    mockQuery.mockResolvedValue({ rowCount: 1 });

    await updateQuery(req, res);

    // 1. Verifica se a função de query do DB foi chamada
    expect(mockQuery).toHaveBeenCalledTimes(1);

    // 2. Verifica o status HTTP e o corpo da resposta
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: expect.stringContaining('RNC ID 101 atualizada com sucesso.'),
      rowsAffected: 1,
    });
    // Verifica o console.log (caminho coberto)
    expect(global.console.log).toHaveBeenCalledWith(expect.stringContaining('RNC ID 101 updated: 1 row(s) affected.'));
  });

  // --- TESTES DE ERROS DE VALIDAÇÃO (Caminho Crítico 400) ---
  
  it('deve retornar status 400 se o corpo da requisição for um array', async () => {
    const req = { method: 'POST', body: [mockValidData] }; 
    const res = mockResponse();

    await updateQuery(req, res);

    // A validação deve ser acionada antes do DB
    expect(mockQuery).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: expect.stringContaining("Dados de atualização ausentes ou em formato incorreto."),
    });
  });
  
  it('deve retornar status 400 se o corpo da requisição for nulo ou sem ID', async () => {
    // 1. Teste com body nulo
    let req = { method: 'POST', body: null }; 
    let res = mockResponse();

    await updateQuery(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    // Reinicia a resposta para o próximo teste de validação
    res = mockResponse();

    // 2. Teste com body sem o 'id' obrigatório
    req = { method: 'POST', body: { nr_op: 'teste' } }; 
    await updateQuery(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: expect.stringContaining("Dados de atualização ausentes ou em formato incorreto."),
    });
  });
  
  // --- TESTES DE ERROS DE DB E LÓGICA ---
  
  it('deve retornar status 404 se o ID existir, mas nenhuma linha for afetada', async () => {
    const req = { method: 'POST', body: mockValidData };
    const res = mockResponse();

    // Simula o DB retornando 0 linhas afetadas (ID não existe na tabela)
    mockQuery.mockResolvedValue({ rowCount: 0 });

    await updateQuery(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: expect.stringContaining("Nenhum RNC encontrado com ID 101 para atualização."),
    });
    // Verifica o console.log (caminho coberto)
    expect(global.console.log).toHaveBeenCalledWith(expect.stringContaining('No RNC found with ID 101 for update.'));
  });

  it('deve retornar status 500 se houver um erro no banco de dados', async () => {
    const req = { method: 'POST', body: mockValidData };
    const res = mockResponse();
    const dbError = new Error("Connection failed");

    // Configura o mock do DB para simular um erro na query
    mockQuery.mockRejectedValue(dbError);

    await updateQuery(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    // Verifica se o console.error foi chamado (para cobrir o log de erro)
    expect(global.console.error).toHaveBeenCalledWith(expect.stringContaining("Error updating data:"), dbError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Failed to update data",
    });
  });

  // --- TESTE DE MÉTODO (Caminho Crítico 405) ---
  
  it('deve retornar status 405 se o método da requisição não for POST', async () => {
    const req = { method: 'GET' }; // Testa com um método diferente
    const res = mockResponse();

    await updateQuery(req, res);

    expect(mockQuery).not.toHaveBeenCalled(); // Não deve tentar acessar o DB
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Method not allowed",
    });
  });
});