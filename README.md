# Módulo de Qualidade para Gestão de RNCs e Checklists

## 📌 Resumo
Este projeto apresenta a proposta de desenvolvimento de um módulo de qualidade para a **gestão de Registros de Não Conformidade (RNCs)** e controle de **checklists de produtos**, com o objetivo de padronizar o controle e promover a melhoria contínua de processos.  
O sistema é parte do Trabalho de Conclusão de Curso em Engenharia de Software e segue os princípios da **ISO 9001**.

---

## 🎯 Objetivo Principal
Desenvolver um módulo web para gerenciamento de **checklists** e **RNCs**, com foco em rastreabilidade, padronização do fluxo e alinhamento com a ISO 9001.

### Objetivos Secundários
- Padronizar o fluxo de verificação de produtos por meio de checklists;
- Permitir o registro e consulta de checklists executados;
- Garantir a rastreabilidade de não conformidades originadas a partir de checklists;
- Aplicar conceitos práticos da ISO 9001 dentro do contexto acadêmico ou organizacional;
- Desenvolver uma interface amigável com usabilidade testada com pelo menos 5 usuários;
- Garantir maior rastreabilidade, mantendo histórico completo de alterações em cada RNC.

---

## 🚨 Problema a Resolver
Atualmente, muitas organizações ainda realizam o controle de checklists e RNCs de forma **manual** ou **descentralizada**, dificultando:
- A rastreabilidade das não conformidades;
- O acompanhamento de inspeções;
- A padronização do fluxo de tratamento;
- A conformidade com normas como a **ISO 9001**.

---

## ⚙️ Requisitos de Software

### Requisitos Funcionais (RF)
- RF01: Cadastro de checklists, incluindo itens de verificação;
- RF02: Execução e preenchimento de checklists;
- RF03: Consulta de checklists executados;
- RF04: Cadastro de RNCs (família, tipo, número de série, status, descrição, responsável e data);
- RF05: Consulta e filtragem de RNCs por status;
- RF06: Edição de RNCs;
- RF07: Cancelamento de RNCs;
- RF08: Upload de anexos (documentos ou imagens);
- RF09: Histórico de alterações em RNCs;
- RF10: Login de usuários;
- RF11: Emissão de relatórios de RNCs por período e status;
- RF12: Exportação de dados de RNCs em PDF.

### Requisitos Não Funcionais (RNF)
- RNF01: Sistema intuitivo e fácil de usar;
- RNF02: Segurança no armazenamento dos dados;
- RNF03: Escalabilidade para futuras melhorias;
- RNF04: Validação de dados antes do envio.

---

## 🚀 Escopo do MVP (Portfólio I)
- RF01: Cadastro de checklists;
- RF02: Execução e preenchimento de checklists;
- RF03: Consulta de checklists executados;
- RF10: Login de usuários.

🔜 **Portfólio II**: Implementação da abertura automática de RNCs a partir dos checklists e fluxo completo de gestão.

---

## 🛠️ Stack Tecnológica
- **Frontend:** React + Next.js  
- **Backend:** Node.js (API RESTful)  
- **Banco de Dados:** PostgreSQL  
- **Arquitetura:** APIs separadas por operação + MVC

---

## 🔒 Segurança
- Autenticação por login/token;
- Proteção contra SQL Injection (ORM);
- Validação de dados em formulários.

---

## 📅 Próximos Passos
**Portfólio I**
- Levantamento detalhado de requisitos;
- Modelagem do banco de dados;
- Protótipo de interfaces;
- CRUD inicial de checklists.

**Portfólio II**
- Abertura automática de RNCs a partir dos checklists;
- Gestão completa de RNCs;
- Regras de segurança avançadas;
- Testes e validações;
- Documentação final e apresentação do TCC.
