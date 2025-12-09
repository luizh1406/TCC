import { jest } from "@jest/globals";
// 🟢 Importa as ferramentas de renderização e interação (se for usar)
import { render, screen } from '@testing-library/react'; 
import jwt from 'jsonwebtoken';
// Mocka o useRouter do Next.js
import { useRouter } from 'next/router';


// =========================================================
// MOCKS GLOBAIS E NEXT.JS
// =========================================================

// Mocka o useRouter (necessário para o componente principal)
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  })),
}));

// Mocka o 'fetch' global
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, data: {} }), 
  })
);

// 🟢 MOCK DO JSONWEBTOKEN
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

// Mock do process.env (crucial para o JWT_SECRET)
process.env.JWT_SECRET = 'TEST_SECRET';


// =========================================================
// IMPORTAÇÕES DO ARQUIVO RNC
// =========================================================

// Importa o componente principal e as funções utilitárias/GSSP
import Rnc, { 
  editServices, 
  editMaterial, 
  addServicos, 
  addMaterial,
  pushList,
  getServerSideProps // 🟢 IMPORTAÇÃO DO GSSP
} from '../../pages/Quality/rnc'; // ⚠️ Ajuste o caminho se necessário


// =========================================================
// MOCKS DE ESTADO
// =========================================================

const setServicos = jest.fn();
const setTotalServicos = jest.fn();
const setMateriais = jest.fn();
const setTotalMateriais = jest.fn();

// Props mockados para o componente principal (para evitar o erro de props.user.email)
const mockUserProps = {
    user: {
        email: 'teste@empresa.com.br',
    },
};


// =========================================================
// SETUP
// =========================================================

beforeEach(() => {
  jest.clearAllMocks();
    // 🟢 Mocka a implementação do JWT para retornar um usuário válido por padrão nos testes
    jwt.verify.mockImplementation((token, secret) => ({ id: 1, email: "user@test.com" }));
});


// --- NOVOS TESTES ADICIONADOS ---

describe('getServerSideProps()', () => {
    
    // Contexto de requisição padrão, sem token e sem user-agent complexo
    const mockContext = {
        req: {
            headers: {},
            cookies: {},
        },
    };

    // TESTE 8: Caminho Sem Token (Cobre a lógica de userAgent 'indisponível' e o caso padrão sem token)
    it('deve retornar user: null quando nenhum token ou user-agent é fornecido', async () => {
        
        // Simula a ausência de headers e cookies
        const context = { req: { headers: {}, cookies: {} } };

        const result = await getServerSideProps(context);

        expect(result.props.user).toBeNull();
        expect(result.props.isMobile).toBe(false); // Indisponível é considerado desktop
        expect(result.props.userAgent).toBe('indisponível');
        expect(jwt.verify).not.toHaveBeenCalled();
    });

    // TESTE 9: Caminho de Token Válido (Cobre o caminho `if (token)` e `try` com detecção de mobile)
    it('deve retornar o objeto user decodificado e detectar mobile corretamente', async () => {
        const validTokenContext = {
            req: {
                headers: {
                    // Simula um user-agent de dispositivo móvel
                    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X)',
                },
                cookies: { token: 'valid-jwt' },
            },
        };

        const result = await getServerSideProps(validTokenContext);

        // Verifica se a detecção de mobile funcionou
        expect(result.props.isMobile).toBe(true); 
        // Verifica se o user foi retornado do mock do JWT
        expect(result.props.user).toEqual({ id: 1, email: "user@test.com" }); 
        expect(jwt.verify).toHaveBeenCalledWith('valid-jwt', 'TEST_SECRET');
    });

    // TESTE 10: Caminho de Token Inválido (Cobre o caminho `try/catch` de erro)
    it('deve retornar user: null quando o token é inválido (erro de verificação)', async () => {
        const invalidTokenContext = {
            req: {
                headers: {},
                cookies: { token: 'invalid-jwt' },
            },
        };
        
        // Força o mock do jwt.verify a lançar um erro (para simular token expirado/alterado)
        jwt.verify.mockImplementation(() => {
            throw new Error('JWT malformed');
        });

        const result = await getServerSideProps(invalidTokenContext);

        expect(result.props.user).toBeNull();
        expect(jwt.verify).toHaveBeenCalled();
    });
});


// ...
describe('Componente de Renderização RNC', () => {

    /* * TESTE 11: Renderiza o componente principal
     * Cobre as linhas de JSX, useEffect, e useState (incluindo o props.user.email)
     */
    it('deve renderizar o layout da RNC corretamente e carregar dados iniciais', () => {
        
        global.fetch.mockClear();
        
        // 🟢 Passando os props mockados para evitar o erro props.user.email
        render(<Rnc {...mockUserProps} />); 

        // 1. Verifique um elemento estático que existe no seu componente. 
        // SUBSTITUÍMOS: expect(screen.getByText(/TÍTULO DA RNC/i)).toBeInTheDocument(); 
        // PELO TEXTO REAL:
        expect(screen.getByText(/Cadastro de RNC/i)).toBeInTheDocument(); // 🟢 CORREÇÃO
        
        // Se o componente tiver um useEffect que chama fetch na montagem, verifique:
        // expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});
// ...


// --- TESTES DE FUNÇÕES UTILITÁRIAS (ANTIGOS) ---

describe('Funções de Edição e Recálculo (editServices / editMaterial)', () => {

  // Dados base para o teste de edição
  const servicosIniciais = [
    { id: 0, codigo: 100, descricao: "Item A", tempo: 5, valorUnitario: 10, valorTotal: 50 },
    { id: 1, codigo: 200, descricao: "Item B", tempo: 2, valorUnitario: 20, valorTotal: 40 },
  ];
  // const totalInicial = 90; // 50 + 40

  /* * TESTE 1: Edição de valor numérico (tempo) e recálculo
   * Cobre a lógica de multiplicação e o loop de soma (soma+=item.valorTotal)
  */
  it('deve editar o tempo e recalcular o valorTotal e o total geral corretamente (editServiços)', () => {
    
    // Altera o tempo do Item A (índice 0) para 10
    editServices(setServicos, servicosIniciais, 0, 'tempo', '10', setTotalServicos);

    // 1. Verifica se setServicos foi chamado com os novos dados
    const [novosServicos] = setServicos.mock.calls[0];
    
    // Item A (índice 0) deve ter o valorTotal atualizado: 10 * 10 = 100
    expect(novosServicos[0].valorTotal).toBe(100);
    expect(novosServicos[0].tempo).toBe(10); // Garante que foi salvo como Número
    
    // Item B (índice 1) deve permanecer o mesmo
    expect(novosServicos[1].valorTotal).toBe(40);

    // 2. Verifica se setTotalServicos foi chamado com o novo total: 100 + 40 = 140
    expect(setTotalServicos).toHaveBeenCalledWith(140);
  });

  /* * TESTE 2: Edição de campo string
   * Cobre a condição (chave==="descricao"||chave==="código") ? valor : Number(valor) || 0,
   * garantindo que strings não afetem cálculos numéricos.
  */
  it('deve editar a descrição sem alterar os valores (editServiços)', () => {
    
    editServices(setServicos, servicosIniciais, 1, 'descricao', 'Item B Editado', setTotalServicos);

    // 1. Verifica se setServicos foi chamado com os novos dados
    const [novosServicos] = setServicos.mock.calls[0];
    
    // Item B (índice 1) deve ter a descrição atualizada
    expect(novosServicos[1].descricao).toBe('Item B Editado');
    // E o valor total deve permanecer 40
    expect(novosServicos[1].valorTotal).toBe(40);
    
    // 2. O total geral deve permanecer 90 (50 + 40)
    expect(setTotalServicos).toHaveBeenCalledWith(90);
  });

  /* * TESTE 3: Caso de valor inválido/nulo (Garante que a lógica Number(valor) || 0 funcione)
   * Cobre o fallback para '0'
  */
  it('deve tratar valores inválidos (null, string vazia) como 0 (editMaterial)', () => {
    const materiaisIniciais = [
      { id: 0, codigo: 100, descricao: "Parafuso", quantidade: 5, valorUnitario: 10, valorTotal: 50 },
    ];
    
    // Tenta definir a quantidade (chave='quantidade') como uma string vazia ''
    editMaterial(setMateriais, materiaisIniciais, 0, 'quantidade', '', setTotalMateriais);

    const [novosMateriais] = setMateriais.mock.calls[0];
    
    // O valorTotal deve ser 0 * 10 = 0
    expect(novosMateriais[0].quantidade).toBe(0); // number(‘’)||0 = 0
    expect(novosMateriais[0].valorTotal).toBe(0); 

    // O total geral deve ser 0
    expect(setTotalMateriais).toHaveBeenCalledWith(0);
  });
});

// ---

describe('Funções de Adição (addServiços / addMaterial)', () => {

  const itemEsperadoBase = {
    codigo: 0,
    descricao: "",
    valorUnitario: 0,
    valorTotal: 0,
  };

  /* * TESTE 4: Adição em lista vazia
   * Cobre a condição: serviços.comprimento > 0 ? serviços[serviços.comprimento - 1].id + 1 : 0;
  */
  it('deve adicionar um novo serviço com id 0 quando a lista estiver vazia', () => {
    
    addServicos(setServicos, []);

    expect(setServicos).toHaveBeenCalledTimes(1);
    const [novaLista] = setServicos.mock.calls[0];
    
    // Verifica o ID
    expect(novaLista[0].id).toBe(0); 
    // Verifica a estrutura
    expect(novaLista[0]).toEqual(expect.objectContaining({ ...itemEsperadoBase, id: 0, tempo: 0 })); 
  });

  /* * TESTE 5: Adição em lista preenchida
   * Cobre a lógica de auto-incremento de ID
  */
  it('deve adicionar um novo material com o próximo ID correto', () => {
    const materiaisPreenchidos = [
      { id: 5, codigo: 1, descricao: "A", quantidade: 1, valorUnitario: 1, valorTotal: 1 },
      { id: 10, codigo: 2, descricao: "B", quantidade: 1, valorUnitario: 1, valorTotal: 1 }, // ID mais alto é 10
    ];
    
    addMaterial(setMateriais, materiaisPreenchidos);

    expect(setMateriais).toHaveBeenCalledTimes(1);
    const [novaLista] = setMateriais.mock.calls[0];
    
    // O ID deve ser o do último item (10) + 1 = 11
    expect(novaLista.length).toBe(3);
    expect(novaLista[2].id).toBe(11); // O novo item deve ter ID 11
    expect(novaLista[2]).toEqual(expect.objectContaining({ ...itemEsperadoBase, id: 11, quantidade: 0 })); 
  });
});

// ---

describe('Função de Envio (pushList)', () => {

  /* * TESTE 6: Cobre todos os caminhos do if/else if/else em pushList
   * Garante que o fetch use a URL correta dependendo do 'Tabela'
  */
  it.each([
    ['materiais', '/api/add/quality/materials'],
    ['servicos', '/api/add/quality/services'],
    ['planos', '/api/add/quality/plan'],
  ])('deve chamar a URL correta para o tipo de tabela: %s', async (tabela, urlEsperada) => {
    const dados = [{ key: 'value' }];
    
    await pushList(dados, tabela);

    // Verifica se fetch foi chamado com a URL correta e método POST
    expect(fetch).toHaveBeenCalledWith(urlEsperada, expect.objectContaining({
      method: "POST",
      body: JSON.stringify(dados),
    }));
  });
  
  /* * TESTE 7: Cobre o caminho 'else' em pushList (Retorno)
  */
  it('não deve fazer a chamada fetch se a tabela for desconhecida', async () => {
    
    await pushList([], 'desconhecido');

    // Verifica se fetch não foi chamado
    expect(fetch).not.toHaveBeenCalled(); 
  });
});
