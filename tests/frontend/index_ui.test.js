/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// Importa o componente Home e a função getServerSideProps
import Home, { getServerSideProps } from "../../pages/index";
import jwt from "jsonwebtoken";

// Mock do JWT
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

// Mocks do Frontend
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
    logout: jest.fn(),
    // MOCK para a função resumeSales não tentar fazer fetch em testes de frontend,
    resultFetch: jest.fn(), 
}));


// --- 1. TESTES PARA getServerSideProps (Lógica de SSR - Backend/API) ---
describe("✅ getServerSideProps (SSR Logic)", () => {
    const mockContext = {
        req: {
            headers: { "user-agent": "Desktop" },
            cookies: {},
        },
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Cobre: Token nulo e isMobile=false
    it("deve retornar isMobile=false e user=null se não houver token", async () => {
        const result = await getServerSideProps(mockContext);
        expect(result.props.isMobile).toBe(false);
        expect(result.props.user).toBeNull();
    });

    // Cobre: isMobile=true (Linha 16)
    it("deve retornar isMobile=true para user-agent mobile", async () => {
        const mobileContext = {
            req: {
                headers: { "user-agent": "iphone" }, // Simula dispositivo móvel
                cookies: {},
            },
        };
        const result = await getServerSideProps(mobileContext);
        expect(result.props.isMobile).toBe(true);
    });

    // Cobre: Token Válido (Caminho de Sucesso L. 26)
    it("deve retornar o objeto de usuário para token válido", async () => {
        const mockUser = { id: 1, name: "Teste" };
        jwt.verify.mockReturnValue(mockUser); // Força sucesso
        
        const contextWithToken = {
            ...mockContext,
            req: { ...mockContext.req, cookies: { token: "validToken" } },
        };
        
        const result = await getServerSideProps(contextWithToken);
        expect(result.props.user).toEqual(mockUser);
    });

    // Cobre: Token Inválido (Caminho de Catch L. 28)
    it("deve retornar user=null se a verificação do token falhar", async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid token"); // Força falha (catch)
        }); 
        
        const contextWithInvalidToken = {
            ...mockContext,
            req: { ...mockContext.req, cookies: { token: "invalidToken" } },
        };

        const result = await getServerSideProps(contextWithInvalidToken);
        expect(result.props.user).toBeNull();
    });
});


// --- 2. TESTES PARA O COMPONENTE HOME (Renderização e Interação) ---
describe("Componente Home", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renderiza título principal (Desktop)", () => {
        render(<Home isMobile={false} userAgent="desktop" user={null} />);
        expect(screen.getByText("CORE - JIMP")).toBeInTheDocument();
        // Verifica que o modo Desktop está renderizando
        expect(screen.getByText("Consultar Checklist")).toBeInTheDocument();
    });

    // TESTE NOVO: Cobrir Renderização Mobile (Linha 317)
    it("renderiza a interface Mobile se isMobile for true", () => {
        render(<Home isMobile={true} userAgent="iphone" user={null} />);
        expect(screen.getByText("Preencher novo checklist")).toBeInTheDocument();
        // Garante que o bloco else (Desktop) NÃO foi executado
        expect(screen.queryByText("Consultar Checklist")).not.toBeInTheDocument(); 
    });


    it("executa logout ao clicar no botão", () => {
        const { logout } = require("../../src/utils/dafaults.fn");
        render(<Home isMobile={false} userAgent="desktop" user={null} />);
        const btns = screen.getAllByRole("button");
        // O último botão é o botão de logout
        fireEvent.click(btns[btns.length - 1]); 
        expect(logout).toHaveBeenCalled();
    });

    // Cobre a mudança de estado e o estilo de item de menu
    it("alterna módulo ao clicar em 'Infra'", () => {
        render(<Home isMobile={false} userAgent="desktop" user={null} />);
        
        // CORREÇÃO APLICADA: Usamos document.getElementById() para buscar o elemento que tem o ID e o estilo.
        const qualityItem = document.getElementById('quality');
        const infraItem = document.getElementById('infra');
        
        // Verifica se os elementos foram encontrados (para evitar falha)
        expect(qualityItem).toBeInTheDocument();
        expect(infraItem).toBeInTheDocument();

        // O valor #F80 é o mockado para stylesColor.dark.orange0.
        // Verifica que o módulo inicial (3 - Qualidade) está ativo
        expect(qualityItem.style.backgroundColor).toBe("rgb(255, 136, 0)"); // JSDOM converte #F80 para RGB
        expect(infraItem.style.backgroundColor).toBe(""); 

        // Clica em Infra (setModule(4))
        fireEvent.click(infraItem);
        
        // Agora Infra deve estar ativo (O JSDOM interpreta o valor do mock '#F80' como 'rgb(255, 136, 0)')
        expect(infraItem.style.backgroundColor).toBe("rgb(255, 136, 0)");
        expect(qualityItem.style.backgroundColor).toBe(""); 

        // Cobre onMouseEnter/onMouseLeave (o estilo muda para 'gray')
        fireEvent.mouseEnter(qualityItem);
        expect(qualityItem.style.backgroundColor).toBe("gray");
        fireEvent.mouseLeave(qualityItem);
        // Volta ao estado normal (não ativo), que é ""
        expect(qualityItem.style.backgroundColor).toBe(""); 
    });
});