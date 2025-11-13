/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../pages/index";

// Mocks
jest.mock("../../src/dimensions/default.dimensions", () => jest.fn(() => ({ width: 100, height: 100 })));
jest.mock("../../src/styles/colors/styles.color", () => ({
  stylesColor: { dark: { blue1: "#001", orange0: "#F80" } },
}));
jest.mock("../../src/styles/containers/containers", () => ({
  menuItem: jest.fn(() => ({})),
  loadingBox: jest.fn(() => ({})),
  loadingLabel: jest.fn(() => ({})),
}));
jest.mock("../../src/utils/dafaults.fn", () => ({
  logout: jest.fn(), // <- diretamente no factory
}));

describe("💻 Componente Home", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza título principal", () => {
    render(<Home isMobile={false} userAgent="desktop" user={null} />);
    expect(screen.getByText("CORE - JIMP")).toBeInTheDocument();
  });

  it("executa logout ao clicar no botão", () => {
    const { logout } = require("../../src/utils/dafaults.fn");
    render(<Home isMobile={false} userAgent="desktop" user={null} />);
    const btns = screen.getAllByRole("button");
    fireEvent.click(btns[btns.length - 1]);
    expect(logout).toHaveBeenCalled();
  });

  it("alterna módulo ao clicar em 'Infra'", () => {
    render(<Home isMobile={false} userAgent="desktop" user={null} />);
    const infra = screen.getByText("Infra");
    fireEvent.click(infra);
    expect(infra).toBeInTheDocument();
  });
});
