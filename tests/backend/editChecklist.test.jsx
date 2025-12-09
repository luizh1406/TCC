/** @jest-environment jsdom */

import { render, screen, act } from "@testing-library/react";
import jwt from "jsonwebtoken";

import EditChecklist, {
  getServerSideProps,
  listOfChecklist,
  filterChecklist,
  selectChecklist
} from "../../pages/Quality/editChecklist.jsx";

import { resultFetch } from "../../src/utils/dafaults.fn";
jest.mock("../../src/utils/dafaults.fn", () => ({
  resultFetch: jest.fn(async () => [{ ns: "10", nome: "Teste", setor: "Q" }]),
  logout: jest.fn()
}));

// mocks globais
global.alert = jest.fn();
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true })
  })
);

jest.spyOn(document, "getElementById").mockImplementation(() => ({
  value: "teste",
  checked: true,
  files: [{ name: "foto.png" }]
}));

process.env.JWT_SECRET = "TEST_SECRET";

//
// ======================================================
// getServerSideProps
// ======================================================
describe("getServerSideProps()", () => {
  function ctx(ua, token) {
    return {
      req: {
        headers: { "user-agent": ua },
        cookies: token ? { token } : {}
      }
    };
  }

  test("token válido retorna user", async () => {
    const u = { email: "a@teste.com", id: 1 };
    const t = jwt.sign(u, process.env.JWT_SECRET);

    const result = await getServerSideProps(ctx("iPhone", t));

    expect(result.props.user.email).toBe(u.email);
    expect(result.props.isMobile).toBe(true);
  });

  test("token inválido retorna user null", async () => {
    const result = await getServerSideProps(ctx("desktop", "invalid"));
    expect(result.props.user).toBe(null);
  });

  test("sem token retorna null", async () => {
    const result = await getServerSideProps(ctx("desktop", null));
    expect(result.props.user).toBe(null);
  });
});

//
// ======================================================
// listOfChecklist()
// ======================================================
describe("listOfChecklist()", () => {
  test("carrega dados e seta estados", async () => {
    const setLoading = jest.fn();
    const setLt = jest.fn();
    const setImg = jest.fn();

    await act(async () => {
      await listOfChecklist(setLoading, setLt, setImg);
    });

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLt).toHaveBeenCalled();
    expect(setImg).toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});

//
// ======================================================
// filterChecklist()
// ======================================================
describe("filterChecklist()", () => {
  test("filtra duplicados", async () => {
    const setLoading = jest.fn();
    const setSel = jest.fn();
    const setId = jest.fn();

    const lista = [
      { ns: "100", nome: "A", setor: "Q" },
      { ns: "100", nome: "A", setor: "Q" },
      { ns: "101", nome: "B", setor: "Q" }
    ];

    await act(async () => {
      filterChecklist(setLoading, lista, "100", setSel, setId);
    });

    const filtrado = setSel.mock.calls[0][0];
    expect(filtrado.length).toBe(2);

    const ids = setId.mock.calls[0][0];
    expect(ids.length).toBe(1);
  });
});

//
// ======================================================
// selectChecklist()
// ======================================================
describe("selectChecklist()", () => {
  test("combina checklist + imagem", async () => {
    const setLoading = jest.fn();
    const setSel = jest.fn();
    const setReady = jest.fn();
    const setNs = jest.fn();

    const lt = [{ ns: 10, nome: "A" }];
    const imgs = [{ ns: 10, path: "x" }];

    await act(async () => {
      selectChecklist(
        setLoading,
        lt,
        10,
        setSel,
        setReady,
        setNs,
        [],
        imgs
      );
    });

    const r = setSel.mock.calls[0][0];
    expect(r.length).toBe(2);
    expect(setReady).toHaveBeenCalledWith(true);
  });
});

//
// ======================================================
// UI
// ======================================================
describe("UI", () => {
  test("renderiza cabeçalho", () => {
    render(<EditChecklist isMobile={false} user={{ email: "x@x.com" }} />);
    expect(screen.getByText("CORE - JIMP")).toBeInTheDocument();
  });

  test("mostra texto NS", () => {
    render(<EditChecklist isMobile={false} user={{ email: "x@x.com" }} />);
    expect(screen.getByText("Informe a NS do produto")).toBeInTheDocument();
  });
});
