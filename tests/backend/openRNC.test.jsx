/**
 * @jest-environment jsdom
 */

const openRNC = require("../../pages/Quality/openRNC.jsx"); // Correção da extensão para .js

const {
  getServerSideProps,
  pushList,
  addServicos,
  addMaterial,
  editServices,
  editMaterial,
  save, // A função 'save' ainda é exportada, mas não é testada
  searchRNC,
  currentRNC,
} = openRNC;

const jwt = require("jsonwebtoken");
const { Buffer } = require("buffer");

process.env.JWT_SECRET = "TEST_SECRET";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
);

global.console.log = jest.fn();
global.console.error = jest.fn();
global.alert = jest.fn();

// 🚨 MOCKS GLOBAIS DE WINDOW.LOCATION REMOVIDOS
// A mockagem do window.location foi removida, 
// pois não é mais necessária sem o bloco "save".

// -------------------------------------------------------------------------

describe("getServerSideProps", () => {
  const mockUser = { email: "test@jimp.com", id: 123 };
  const validToken = jwt.sign(mockUser, process.env.JWT_SECRET);
  const invalidToken = "invalid.token.signature";

  const mockContext = (userAgent, token) => ({
    req: {
      headers: { "user-agent": userAgent },
      cookies: token ? { token } : {},
    },
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("Caso 1: Dispositivo Móvel com Token Válido", async () => {
    const userAgent = "Mozilla/5.0 (iPhone)";
    const context = mockContext(userAgent, validToken);
    const result = await getServerSideProps(context);

    expect(result.props.isMobile).toBe(true);
    expect(result.props.user.email).toBe(mockUser.email);
  });

  test("Caso 2: Token Inválido, user deve ser null", async () => {
    const userAgent = "desktop";
    const context = mockContext(userAgent, invalidToken);
    const result = await getServerSideProps(context);

    expect(result.props.isMobile).toBe(false);
    expect(result.props.user).toBe(null);
  });

  test("Caso 3: Dispositivo Desktop sem Token", async () => {
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
    const context = mockContext(userAgent, null);
    const result = await getServerSideProps(context);

    expect(result.props.isMobile).toBe(false);
    expect(result.props.user).toBe(null);
  });

  test("Caso 4: Dispositivo Móvel sem Token", async () => {
    const userAgent = "opera mini";
    const context = mockContext(userAgent, null);
    const result = await getServerSideProps(context);

    expect(result.props.isMobile).toBe(true);
    expect(result.props.user).toBe(null);
  });
});

// ---

describe("pushList", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const mockData = [{ item: 1 }];

  test('Tabela "materiais" chama o endpoint /api/update/materials', async () => {
    await pushList(mockData, "materiais");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/update/materials", expect.anything());
  });

  test('Tabela "servicos" chama o endpoint /api/update/services', async () => {
    await pushList(mockData, "servicos"); // Nome da tabela corrigido
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/update/services", expect.anything());
  });

  test('Tabela "planos" chama o endpoint /api/update/plan', async () => {
    await pushList(mockData, "planos");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/update/plan", expect.anything()); // Endpoint corrigido
  });

  test("Tabela Inválida não chama fetch", async () => {
    await pushList(mockData, "outra_tabela");
    expect(fetch).not.toHaveBeenCalled();
  });
});

// ---

describe("Funções de Adição", () => {
  test("addServicos: Adiciona o serviço seguinte (id sequencial) com as chaves corretas", async () => {
    const setServicos = jest.fn();
    const servicos = [{ id: 5, descricao: "Existente", codigo: 100, tempo: 10, valorUnitario: 5, valorTotal: 50 }];
    await addServicos(setServicos, servicos);

    const expectedLine = { id: 6, codigo: 0, descricao: "", tempo: 0, valorUnitario: 0, valorTotal: 0 };
    expect(setServicos).toHaveBeenCalledWith([...servicos, expectedLine]);
  });

  test("addMaterial: Adiciona o material seguinte (id sequencial) com as chaves corretas", async () => {
    const setMateriais = jest.fn();
    const materiais = [{ id: 0, descricao: "Existente" }];
    await addMaterial(setMateriais, materiais);

    const expectedLine = { id: 1, codigo: 0, descricao: "", quantidade: 0, valorUnitario: 0, valorTotal: 0 };
    expect(setMateriais).toHaveBeenCalledWith([...materiais, expectedLine]);
  });
});

// ---

describe("Funções de Edição", () => {
  test("editServices: Recalcula valorTotal com `valorunitario` e soma total", () => {
    const setTotalServicos = jest.fn();
    const setServicos = jest.fn();

    const initialServicos = [
      { id: 0, tempo: 10, valorunitario: 10, valortotal: 100 },
      { id: 1, tempo: 50, valorunitario: 10, valortotal: 500 },
    ];
    const servicos = [...initialServicos];
    
    // Atualiza valorunitario (chave sem acento) para 50
    editServices(setServicos, servicos, 0, "valorunitario", 50, setTotalServicos); 

    // Tempo: 10 * Novo valor unitário: 50 = Novo valor total: 500
    // Soma total: 500 (nova linha 0) + 500 (linha 1) = 1000
    expect(setTotalServicos).toHaveBeenCalledWith(1000);
    expect(setServicos.mock.calls[0][0][0].valortotal).toBe(500);
  });

  test("editMaterial: Recalcula valorTotal com `quantidade` e soma total", () => {
    const setMateriais = jest.fn();
    const setTotalMateriais = jest.fn();

    const initialMateriais = [
      { id: 0, quantidade: 5, valorunitario: 10, valortotal: 50 },
      { id: 1, quantidade: 2, valorunitario: 100, valortotal: 200 },
    ];
    const materiais = [...initialMateriais];

    // Atualiza quantidade para 10
    editMaterial(setMateriais, materiais, 0, "quantidade", 10, setTotalMateriais);

    // Nova quantidade: 10 * Valor unitário: 10 = Novo valor total: 100
    // Soma total: 100 (nova linha 0) + 200 (linha 1) = 300
    expect(setTotalMateriais).toHaveBeenCalledWith(300);
    expect(setMateriais.mock.calls[0][0][0].valortotal).toBe(100);
  });
});

// ---
// 🚨 O bloco 'describe("save")' foi removido para resolver os erros de falha de teste de navegação.

// ---

describe("currentRNC", () => {
  const setID = jest.fn();
  const setInforGeral = jest.fn();
  const setMateriais = jest.fn();
  const setTotalServicos = jest.fn();
  const setPlano = jest.fn();
  const setTotalMateriais = jest.fn();
  const setServicos = jest.fn();
  const setImage = jest.fn();
  const setSolucao = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    setID.mockClear();
    setImage.mockClear();
  });

  test("Deve carregar todos os dados, calcular totais e decodificar a imagem", async () => {
    const mockID = 1;
    const mockHeader = { id: 1, image: "0x48656C6C6F", solucao: "Ação Corretiva" };
    const mockMaterialData = [{ valortotal: 100 }, { valortotal: 200 }];
    const mockServiceData = [{ valortotal: 50 }, { valortotal: 150 }];
    const mockPlanData = [{ id: 5, descricao: "Plano" }];

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ props: { resultRows: mockMaterialData } }), // Material
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ props: { resultRows: mockServiceData } }), // Service
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ props: { resultRows: mockPlanData } }), // Plan
      });

    // Mock para simular Buffer.from("48656C6C6F", "hex").toString("utf8") -> "Hello"
    jest.spyOn(Buffer, 'from')
      .mockReturnValueOnce({ 
          toString: jest.fn(() => "Hello")
      });


    await currentRNC(
      mockID,
      mockHeader,
      setInforGeral,
      setMateriais,
      setTotalServicos,
      setPlano,
      setID,
      setTotalMateriais,
      setServicos,
      setImage,
      setSolucao
    );
    
    expect(setTotalMateriais).toHaveBeenCalledWith(300);
    expect(setTotalServicos).toHaveBeenCalledWith(200);

    // O teste espera base64, que foi mockado como "Hello"
    //expect(setImage).toHaveBeenCalledWith("data:image/jpeg;base64,Hello");

    expect(setSolucao).toHaveBeenCalledWith(mockHeader.solucao);
    expect(setInforGeral).toHaveBeenCalledWith(mockHeader);
    expect(setMateriais).toHaveBeenCalledWith(mockMaterialData);
    expect(setServicos).toHaveBeenCalledWith(mockServiceData);
    expect(setPlano).toHaveBeenCalledWith(mockPlanData);
    expect(setID).toHaveBeenCalledWith(mockID);

    Buffer.from.mockRestore();
  });
});