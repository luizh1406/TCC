const linksList = {
  sidebarOptions: {
    home: {
      descricao: "Página inicial",
      route: "./",
      id: "home",
    },
    saleOrder: {
      descricao: "Pedidos de vendas",
      route: "./Sales/sales",
      id: "saleOrder",
    },
    steel: {
      descricao: "Controle de MP",
      route: "./mpController",
      id: "mpController",
    },
    structureHandler: {
      descricao: "Manipulador de estrutura",
      route: "./structureHandler",
      id: "structureHandler",
    },
  },

  saleOrder: {
    addBudget: {
      descricao: "Lançamento de Pedidos",
      route: "./Sales/addBudget",
      id: "addBudget",
    },
    searchBudgets: {
      descricao: "Consulta pedidos lançados",
      route: "./searchBudgets",
      id: "searchBudgets"
    },
    budgetConfig: {
      descricao: "Configuração pedidos de venda",
      route: "./budgetConfig",
      id: "budgetConfig"
    },
  },

  mpController: {
    addSize: {
      descricao: "Cadastro de materiais",
      route: "./addMP",
    },
    searchStorage: {
      descricao: "Consulta de estoques",
      route: "./mpStock",
    },
    addStorage: {
      descricao: "Lançamento de movimentos de MP",
      route: "./addStorage",
    },
  },
};
export default linksList;
