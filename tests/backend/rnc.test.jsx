// rnc.test.js

// Importa as funções utilitárias do arquivo rnc.jsx (necessário que estejam exportadas)
import { 
  editServices, 
  editMaterial, 
  addServicos, 
  addMaterial,
  pushList 
} from '../../pages/Quality/rnc'; // ⚠️ Ajuste o caminho conforme sua estrutura

// Mocka as funções de callback que manipulam o estado
const setServicos = jest.fn();
const setTotalServicos = jest.fn();
const setMateriais = jest.fn();
const setTotalMateriais = jest.fn();

// Mocka o 'fetch' para cobrir a função pushList (opcional, mas recomendado)
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
);

beforeEach(() => {
  jest.clearAllMocks();
});

// --- Início dos testes ---

describe('Funções de Edição e Recálculo (editServices / editMaterial)', () => {

  // Dados base para o teste de edição
  const servicosIniciais = [
    { id: 0, codigo: 100, descricao: "Item A", tempo: 5, valorUnitario: 10, valorTotal: 50 },
    { id: 1, codigo: 200, descricao: "Item B", tempo: 2, valorUnitario: 20, valorTotal: 40 },
  ];
  const totalInicial = 90; // 50 + 40

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

// ---

// OBS: Para cobrir as 49 linhas, você ainda precisará adicionar testes para:
// 1. obterPropriedadesDoLadoDoServidor (Mock de JWT e User Agent)
// 2. O componente Index (handleGeneralInfoNumberBlur, handleImageUpload, useEffect e a renderização)
// 3. A função salvar (que encadeia vários 'fetch' mocks)