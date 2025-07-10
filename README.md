
# 📦 Módulo de Qualidade para Gestão de RNCs

## 📑 Resumo

Este projeto propõe o desenvolvimento de um módulo de qualidade para a **gestão de Registros de Não Conformidade (RNCs)**, com foco em **padronização**, **rastreabilidade** e **melhoria contínua**. O sistema segue os princípios da **norma ISO 9001** e será desenvolvido como parte do **TCC de Engenharia de Software**.

---

## 📌 Introdução e Descrição do Projeto

### 🔍 Contexto
A gestão da qualidade é essencial para processos eficientes. A norma **ISO 9001** inclui o controle de não conformidades como um dos critérios para o SGQ.

### 🛠 Justificativa
A ausência de padronização no tratamento de RNCs compromete a rastreabilidade e dificulta ações corretivas. Um sistema digital facilita **auditorias** e promove a organização.

### 🎯 Objetivos

#### Objetivo Principal
- Desenvolver um **módulo web** para gerenciamento de RNCs, com foco em **rastreabilidade**, **padronização** e conformidade com a **ISO 9001**.

#### Objetivos Secundários
- Padronizar o fluxo de registro/atualização via formulário validado;
- Permitir consulta com filtros (status, período);
- Aplicar conceitos práticos da ISO 9001;
- Desenvolver uma interface amigável com testes de usabilidade;
- Manter histórico completo de alterações.

### ❓ Problema a Resolver
O controle de RNCs ainda é manual em muitas instituições, prejudicando rastreabilidade, controle e conformidade com a ISO 9001.

### ⚠️ Limitações
- Sem integração com outros sistemas;
- Não inclui análise estatística avançada nesta versão.

---

## 🧾 Requisitos de Software

### ✅ Requisitos Funcionais (RF)

| Código | Descrição |
|--------|-----------|
| RF01 | Cadastro de RNCs com campos detalhados |
| RF02 | Consulta e filtragem por status |
| RF03 | Edição de RNCs |
| RF04 | Cancelamento de RNCs |
| RF05 | Upload de anexos |
| RF06 | Visualizar histórico de alterações |
| RF07 | Login de usuários |
| RF08 | Níveis de acesso (operador/gestor) |
| RF09 | Emissão de relatórios |
| RF10 | Exportação em PDF |

### 🚫 Requisitos Não Funcionais (RNF)

- RNF01: Interface intuitiva
- RNF02: Segurança no armazenamento
- RNF03: Escalável para futuras melhorias
- RNF04: Validação de dados de entrada

---

## 🧪 Escopo do MVP (Portfólio I)

Funcionalidades da primeira entrega:

- RF01: Cadastro de RNCs  
- RF02: Consulta e filtragem  
- RF03: Edição de RNCs  
- RF07: Login  
- RF08: Níveis de acesso  

---

## 🧱 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | **React + Next.js** | Interfaces modernas, SSR e SPA |
| Backend | **Node.js (API RESTful)** | Uniformidade JS, desacoplamento |
| Banco de Dados | **PostgreSQL** | Robusto, seguro e escalável |
| Arquitetura | **APIs separadas por operação** | Modularidade e segurança |

---

## 🏗️ Design, Arquitetura e Modelos C4

### Arquitetura
- Modular: Frontend e Backend desacoplados
- Padrão MVC
- Modelos C4:

| Nível | Elementos |
|-------|-----------|
| Contexto | Sistema acadêmico |
| Contêineres | Frontend (Next.js), Backend (Node.js), Banco de dados (PostgreSQL) |
| Componentes | Tela de CRUD, API REST |
| Código | Separação por camadas (controllers, services, models) |

---

## 🔐 Segurança

- Autenticação de usuários (login ou token)
- Proteção contra SQL Injection (ORM)
- Validação de dados nos formulários

---

## 📆 Próximos Passos

### Portfólio I
- Levantamento de requisitos
- Modelagem do banco
- Protótipos de interface
- CRUD básico

### Portfólio II
- Finalização do sistema
- Regras de segurança
- Testes e validações
- Documentação e apresentação
