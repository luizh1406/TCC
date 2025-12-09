/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import jwt from "jsonwebtoken";

// IMPORTA O COMPONENTE COMO PASCALCASE
import IndexRNC, {
  getServerSideProps,
  pushList,
  addServicos,
  addMaterial,
  editServices,
  editMaterial,
  currentRNC,
  searchRNC
} from "../../pages/Quality/openRNC.jsx";

process.env.JWT_SECRET = "TEST_SECRET";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({ props: { resultRows: [] }, success: true }),
  })
);
global.alert = jest.fn();

//
// ==== MOCK PARA ELIMINAR WARNINGS DE ACT()
//     searchRNC(), currentRNC() e outros usam setState internamente
//     então para o teste NÃO TRIGGAR hooks, nós mockamos eles
//
jest.spyOn(console, "error").mockImplementation(() => {}); // esconde warnings
jest.spyOn(console, "log").mockImplementation(() => {});

// MOCKA searchRNC para evitar setStates durante o teste
jest.mock("../../pages/Quality/openRNC.jsx", () => {
  const original = jest.requireActual("../../pages/Quality/openRNC.jsx");
  return {
    __esModule: true,
    ...original,
    searchRNC: jest.fn(() => Promise.resolve([])),
  };
});

//
// =============================
// TESTES
// =============================
//

describe("getServerSideProps()", () => {

  const mockUser = { email: "test@jimp.com", id: 1 };
  const valid = jwt.sign(mockUser, process.env.JWT_SECRET);

  const ctx = (ua, token) => ({
    req: {
      headers: { "user-agent": ua },
      cookies: token ? { token } : {},
    },
  });

  test("mobile + token válido", async () => {
    const result = await getServerSideProps(ctx("iPhone", valid));
    expect(result.props.user.email).toBe(mockUser.email);
    expect(result.props.isMobile).toBe(true);
  });

  test("token inválido → user null", async () => {
    const result = await getServerSideProps(ctx("desktop", "x"));
    expect(result.props.user).toBe(null);
  });

  test("sem token", async () => {
    const result = await getServerSideProps(ctx("desktop", null));
    expect(result.props.user).toBe(null);
    expect(result.props.isMobile).toBe(false);
  });
});

describe("pushList()", () => {
  beforeEach(() => fetch.mockClear());

  const data = [{ a: 1 }];

  test("materiais → /api/update/materials", async () => {
    await pushList(data, "materiais");
    expect(fetch).toHaveBeenCalledWith("/api/update/materials", expect.anything());
  });

  test("servicos → /api/update/services", async () => {
    await pushList(data, "servicos");
    expect(fetch).toHaveBeenCalledWith("/api/update/services", expect.anything());
  });

  test("planos → /api/update/plan", async () => {
    await pushList(data, "planos");
    expect(fetch).toHaveBeenCalledWith("/api/update/plan", expect.anything());
  });

  test("inválido → não chama fetch", async () => {
    await pushList(data, "outra");
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("Funções add/edit", () => {

  test("addServicos()", () => {
    const set = jest.fn();
    const base = [{ id: 7 }];
    addServicos(set, base);
    expect(set).toHaveBeenCalled();
    expect(set.mock.calls[0][0][1].id).toBe(8);
  });

  test("addMaterial()", () => {
    const set = jest.fn();
    addMaterial(set, [{ id: 0 }]);
    expect(set.mock.calls[0][0][1].id).toBe(1);
  });

  test("editServices recalcula total", () => {
    const set = jest.fn();
    const setTotal = jest.fn();

    const base = [
      { id: 0, tempo: 10, valorunitario: 10, valortotal: 100 },
      { id: 1, tempo: 5, valorunitario: 20, valortotal: 100 },
    ];

    editServices(set, base, 0, "valorunitario", 50, setTotal);

    expect(setTotal).toHaveBeenCalledWith(50 * 10 + 100);
  });

  test("editMaterial recalcula total", () => {
    const set = jest.fn();
    const setTotal = jest.fn();

    const base = [
      { id: 0, quantidade: 5, valorunitario: 10, valortotal: 50 },
      { id: 1, quantidade: 2, valorunitario: 20, valortotal: 40 },
    ];

    editMaterial(set, base, 0, "quantidade", 10, setTotal);

    expect(setTotal).toHaveBeenCalledWith(100 + 40);
  });
});

describe("currentRNC()", () => {

  const setID = jest.fn();
  const setInf = jest.fn();
  const setMat = jest.fn();
  const setTotSrv = jest.fn();
  const setPlano = jest.fn();
  const setTotMat = jest.fn();
  const setSrv = jest.fn();
  const setImage = jest.fn();
  const setSolucao = jest.fn();

  test("carrega dados e calcula totais", async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ props: { resultRows: [{ valortotal: 100 }] } }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ props: { resultRows: [{ valortotal: 200 }] } }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ props: { resultRows: [{ id: 5 }] } }),
      });

    const header = { id: 1, image: "0x41", solucao: "OK" };
    jest.spyOn(Buffer, "from").mockReturnValue({ toString: () => "A" });

    await currentRNC(
      1,
      header,
      setInf,
      setMat,
      setTotSrv,
      setPlano,
      setID,
      setTotMat,
      setSrv,
      setImage,
      setSolucao
    );

    expect(setTotMat).toHaveBeenCalledWith(100);
    expect(setTotSrv).toHaveBeenCalledWith(200);
    expect(setSolucao).toHaveBeenCalledWith("OK");

    Buffer.from.mockRestore();
  });
});

//
// ======================================
// TESTES DE UI — SEM DEPENDER DE BOTÕES
// ======================================
//

describe("UI — renderização básica", () => {

  test("renderiza sem crash", () => {
    render(<IndexRNC user={{ email: "a@b.com" }} />);

    // verifica pelo título fixo que EXISTE NA PAGE
    expect(screen.getByText("Consulta de RNC")).toBeInTheDocument();
  });

});
