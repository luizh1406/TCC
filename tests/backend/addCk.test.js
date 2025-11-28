import pool from "../../pages/api/database.js";
import insertQuery from "../../pages/api/add/quality/addCk.js";

// Mock do banco (Postgres)
jest.mock("../../pages/api/database.js", () => ({
  query: jest.fn(),
}));

describe("addCk API", () => {
 
 // Limpa os mocks antes de cada teste
 beforeEach(() => {
   pool.query.mockClear();
   });

 // TESTE 1: Caminho de Sucesso (Cobre a maior parte do código)
  it("deve inserir dados corretamente e retornar 201", async () => {
    const req = {
      method: "POST",
      body: {
        questions: [
          {
            nome: "Teste",
            linha: "Linha 1",
            familia: "Família A",
            setor: "Setor 1",
            sequencia: "1",
            descricao: "Desc",
            preenchimento: "Sim",
            codigo_pergunta: "001",
          },
        ],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Simula retorno do Postgres
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, nome: "Teste" }],
    });

    await insertQuery(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      cfData: { id: 1, nome: "Teste" },
    });
  });

  // TESTE 2: Cobrir L.8 (Method not allowed)
  it("deve retornar 405 se o método não for POST", async () => {
    const req = {
      method: "GET", // Força o método inválido
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await insertQuery(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Method not allowed",
    });
  });

  // TESTE 3: Cobrir L.25 (`questions` não é um array)
  it("deve retornar 400 se `questions` não for um array válido", async () => {
    const req = {
      method: "POST",
      body: {
        questions: "apenas uma string, não um array", // Força o tipo inválido
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await insertQuery(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "`questions` deve ser um array",
    });
  });

  // TESTE 4: Cobrir L.55-56 (Bloco catch / Erro no DB)
  it("deve retornar 500 em caso de erro no banco de dados (catch block)", async () => {
    const req = {
      method: "POST",
      body: {
        questions: [{ nome: "Teste", linha: "L1" }],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // 1. Força a mock function a rejeitar (simula erro do DB)
    const dbError = new Error("Simulated DB Failure");
    pool.query.mockRejectedValueOnce(dbError);

    // 2. Simula o console.error para cobrir a L.54 sem poluir o log
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await insertQuery(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Failed to insert data",
    });
    
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error inserting data:", dbError);
    
    consoleErrorSpy.mockRestore();
  });

});