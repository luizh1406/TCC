import { jest } from "@jest/globals";
import fs from "fs";

// =============================
// MOCK DO MULTER (antes de tudo)
// =============================
jest.mock("multer", () => {
  return () => ({
    any: () => (req, res, next) => next() // ignora uploads
  });
});

// =============================
// MOCK DO FS
// =============================
jest.mock("fs", () => ({
  readFileSync: jest.fn(() => Buffer.from("fake-image")),
  unlinkSync: jest.fn(),
}));

// =============================
// MOCK DO DATABASE (caminho real)
// =============================
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock("../../pages/api/database.js", () => ({
  __esModule: true,
  default: {
    connect: jest.fn(() => mockClient),
  },
}));

// =============================
// IMPORTAR O ARQUIVO REAL
// =============================
import insertQueryWithUpload, {
  runMiddleware,
  processQuestion
} from "../../pages/api/add/quality/clChecklist.js";

// =============================
// TESTES
// =============================

describe("runMiddleware()", () => {
  test("resolve quando não há erro", async () => {
    const fn = (req, res, next) => next();
    await expect(runMiddleware({}, {}, fn)).resolves.toBeUndefined();
  });

  test("reject quando middleware retorna erro", async () => {
    const fn = (req, res, next) => next(new Error("middleware error"));
    await expect(runMiddleware({}, {}, fn)).rejects.toThrow("middleware error");
  });
});

describe("processQuestion()", () => {
  test("retorna null se a chave não é *_info", () => {
    const result = processQuestion("abc", { body: {} });
    expect(result).toBeNull();
  });

  test("processa pergunta normal", () => {
    const req = {
      body: {
        q1_info: JSON.stringify({
          codigo_pergunta: "q1",
          preenchimento: "Texto",
          nome: "n",
          linha: "l"
        }),
        q1: "valor",
        nsProduto: "999",
        userEmail: "test@test.com"
      },
      files: []
    };

    const out = processQuestion("q1_info", req);
    expect(out.value).toBe("valor");
    expect(out.user_email).toBe("test@test.com");
    expect(out.ns).toBe("999");
  });

  test("processa pergunta com foto", () => {
    const req = {
      body: {
        foto_info: JSON.stringify({
          codigo_pergunta: "foto1",
          preenchimento: "Foto"
        }),
        nsProduto: "A1",
        userEmail: "u@test.com"
      },
      files: [{ fieldname: "foto1", path: "/tmp/foto.png" }]
    };

    const out = processQuestion("foto_info", req);

    expect(out.value).toBeInstanceOf(Buffer);
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();
  });
});

describe("insertQueryWithUpload()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("retorna 405 quando método não é POST", async () => {
    const req = { method: "GET" };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await insertQueryWithUpload(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Método não permitido",
    });
  });

  test("retorna 200 quando DB funciona", async () => {
    // corpo válido com *_info
    const req = {
      method: "POST",
      body: {
        q1_info: JSON.stringify({
          nome: "Teste Nome",
          codigo_pergunta: "q1",
          linha: "L1",
          familia: "F1",
          setor: "S1",
          sequencia: 1,
          descricao: "Desc",
          preenchimento: "Texto",
        }),
        q1: "valor",
        nsProduto: "123",
        userEmail: "u@test.com",
      },
      files: [],
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // mocks para transação OK
    mockClient.query
      .mockResolvedValueOnce() // BEGIN
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // INSERT normal
      .mockResolvedValueOnce({ rows: [] }) // INSERT images
      .mockResolvedValueOnce(); // COMMIT

    await insertQueryWithUpload(req, res);

    expect(mockClient.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );
  });

  test("faz rollback quando DB lança erro", async () => {
    const req = {
      method: "POST",
      body: {
        q1_info: JSON.stringify({
          nome: "Teste",
          codigo_pergunta: "q1",
          linha: "L1",
          familia: "F1",
          setor: "S1",
          sequencia: 1,
          descricao: "Desc",
          preenchimento: "Texto",
        }),
        q1: "valor",
        nsProduto: "123",
        userEmail: "u@test.com",
      },
      files: [],
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // força erro no INSERT
    mockClient.query
      .mockResolvedValueOnce() // BEGIN
      .mockRejectedValueOnce(new Error("DB error")) // INSERT falha
      .mockResolvedValueOnce(); // ROLLBACK

    await insertQueryWithUpload(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Falha ao inserir os dados no banco",
    });
  });
});
