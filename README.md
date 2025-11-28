# Módulo de Qualidade – Checklists e RNCs

Este projeto implementa um módulo completo de qualidade composto por **Checklists de inspeção** e **Registros de Não Conformidade (RNCs)**.  
O objetivo é padronizar processos, garantir rastreabilidade e facilitar auditorias internas, alinhado aos princípios da ISO 9001.

---

##  Funcionalidades

###  Módulo de Checklists
- Cadastro de checklists com campos configuráveis  
- Preenchimento via interface web  
- Marcação de itens verificados  
- Observações e anotações  
- Histórico completo de inspeções  
- *Não gera RNC automaticamente*  
  - Caso haja falhas, o usuário decide manualmente se abrirá uma RNC

### ✔ Módulo de RNCs
- Cadastro manual de RNCs  
- Informações completas do produto  
- Descrição do ocorrido  
- Plano de ação  
- Registro de materiais e serviços utilizados  
- Upload de anexos (imagens/documentos)  
- Atualização de status  
- Histórico e rastreabilidade  

---

##  Stack Tecnológico

###  Front-end
- **React + Next.js**
- SSR, SSG e SPA
- Roteamento simplificado
- Interface rápida e responsiva

###  Back-end
- **Node.js + API RESTful**
- Arquitetura em camadas  
  `Controllers → Services → Repositories`

###  Banco de Dados
- **PostgreSQL (NeonDB)**  
- Suporte a transações, integridade e alta performance

###  Deploy
- **Render**
- Deploy automático via CI/CD
- Logs centralizados

###  CI/CD
- **GitHub Actions**
- Pipeline completo:
  1. Instala dependências  
  2. Executa testes (Jest)  
  3. Envia cobertura ao SonarCloud  
  4. Análise estática  
  5. Build + Deploy automático

---

##  Qualidade de Código

###  Testes Unitários
- Biblioteca **Jest**
- Cobertura das regras de negócio e serviços

###  Teste de Caixa Branca
- **SonarCloud**
  - Code smells  
  - Complexidade  
  - Vulnerabilidades  
  - Duplicações  
  - Cobertura dos testes  

###  Monitoramento
- **UptimeRobot**
- Monitoramento contínuo:
  - Uptime  
  - Tempo de resposta  
  - Quedas  
  - Estabilidade  

---

##  Segurança

- Autenticação por token  
- Prevenção contra SQL Injection (ORM)  
- Validações no back-end e front-end  
- HTTPS via Render  

---

##  Arquitetura

- Arquitetura modular  
- Front-end separado do back-end  
- API REST desacoplada  
- MVC + camadas de serviço  
- Modelos C4 utilizados no planejamento  
  - Contexto  
  - Contêineres  
  - Componentes  
  - Código  

---

##  Sobre o Projeto

Este sistema foi desenvolvido como parte do **Trabalho de Conclusão de Curso em Engenharia de Software**, com foco em:

- padronização de inspeções,  
- rastreabilidade de falhas,  
- melhoria contínua,  
- boas práticas de desenvolvimento moderno.

---

##  Autor
**Luiz Henrique de Oliveira**  
Joinville – SC  
