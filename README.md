Módulo de Qualidade para Gestão de RNCs


RESUMO

Este documento apresenta a proposta de desenvolvimento de um módulo de qualidade para a gestão de Registros de Não Conformidade (RNCs), com o objetivo de padronizar o controle e promover a melhoria contínua de processos. O módulo será desenvolvido como parte do Trabalho de Conclusão de Curso em Engenharia de Software e visa atender aos princípios estabelecidos pela norma ISO 9001. Serão abordados os requisitos funcionais e não funcionais, além de aspectos técnicos, arquitetônicos e de segurança do sistema. 
INTRODUÇÃO E DESCRIÇÃO DO PROJETO

Contexto:
A gestão da qualidade é um dos pilares fundamentais para a eficiência de processos em organizações. A ISO 9001 define critérios para um sistema de gestão da qualidade, entre os quais está o controle de não conformidades.
Justificativa:
A falta de padronização no tratamento de RNCs compromete a rastreabilidade e dificulta análises para melhoria contínua. Um sistema digital de gestão de RNCs facilita auditorias, promove organização e auxilia no atendimento aos requisitos normativos.
Objetivos:
●	Objetivo principal: Desenvolver um módulo web para gerenciamento de Registros de Não Conformidade (RNCs), com foco em rastreabilidade, padronização do fluxo e alinhamento com a norma ISO 9001.
●	Objetivos secundários:
o	Padronizar o fluxo de registro e atualização de RNCs com um formulário validado;
o	Permitir consulta eficiente de RNCs com filtros por status e período;
o	Aplicar conceitos práticos da ISO 9001 dentro do contexto acadêmico ou organizacional;
o	Desenvolver uma interface amigável com usabilidade testada com pelo menos 5 usuários;
o	Garantir maior rastreabilidade, mantendo histórico completo de alterações em cada RNC.
Tema do Projeto:

Desenvolvimento de um módulo web para gestão de Registros de Não Conformidade (RNCs), focado em controle, rastreabilidade e alinhamento com normas de qualidade.
Problema a Resolver:
Em muitas organizações e instituições de ensino, o controle de Registros de Não Conformidade (RNCs) ainda é feito de forma manual ou descentralizada, o que gera dificuldades como a falta de rastreabilidade, a dificuldade de acompanhar o andamento das não conformidades e a ausência de um fluxo padronizado para tratamento dos registros. Isso compromete a eficácia das ações corretivas e dificulta a conformidade com normas como a ISO 9001.
Limitações:
●	Projeto não incluirá integração com outros sistemas;
●	Não serão abordadas funcionalidades de análise estatística avançada de RNCs nesta versão inicial.
REQUISITOS DE SOFTWARE E STACK TECNOLÓGICA

Requisitos Funcionais (RF):
●	RF01: O sistema deve permitir o cadastro de RNCs com campos como família do produto, tipo do produto, NS (Número de Série), status, descrição, responsável e data.
●	RF02: O sistema deve permitir a consulta e filtragem de RNCs por status.
●	RF03: O sistema deve permitir a edição de RNCs para atualização do seu andamento.
●	RF04: O sistema deve permitir o cancelamento de RNCs.
●	RF05: O sistema deve permitir o upload de anexos (documentos ou imagens) nas RNCs.
●	RF06: O sistema deve permitir visualizar o histórico de alterações de uma RNC.
●	RF07: O sistema deve permitir o login com autenticação de usuários.
●	RF08: O sistema deve oferecer diferentes níveis de acesso (ex: operador e gestor).
●	RF09: O sistema deve permitir a emissão de relatórios de RNCs por período e status.
●	RF10: O sistema deve permitir a exportação de dados das RNCs em formato PDF.
Requisitos Não Funcionais (RNF):
●	RNF01: O sistema deve ser intuitivo e fácil de usar, permitindo que usuários com conhecimento básico em informática consigam navegar sem dificuldades.
●	RNF02: Segurança no armazenamento dos dados.
●	RNF03: Escalabilidade para futuras melhorias.
●	RNF04: O sistema deve validar os dados dos formulários antes do envio para evitar falhas de entrada.
Representação dos Requisitos:
 
Escopo do MVP (Versão Inicial Funcional)
Para o Portfólio I, o projeto focará no desenvolvimento das seguintes funcionalidades essenciais:
●	RF01: Cadastro de RNCs

●	RF02: Consulta e filtragem por status

●	RF03: Edição de RNCs

●	RF07: Login de usuários

●	RF08: Níveis de acesso básico (operador e gestor)

As demais funcionalidades serão planejadas para a fase seguinte (Portfólio II), conforme cronograma de desenvolvimento.

Stack Tecnológico
Para o desenvolvimento do módulo de qualidade para gestão de Registros de Não Conformidade (RNCs), a escolha do stack tecnológico foi pautada em critérios de escalabilidade, manutenção, desempenho e aderência às melhores práticas de engenharia de software.
●	Front-end: HTML + React + Next.js
 O React foi escolhido por ser uma biblioteca moderna, amplamente utilizada para construção de interfaces dinâmicas e responsivas, o que facilita a criação de uma experiência intuitiva para o usuário, conforme o requisito não funcional de facilidade de uso. O Next.js complementa o React, trazendo vantagens como renderização híbrida (SSR e SPA), otimização de performance e roteamento simplificado, beneficiando a escalabilidade e organização do código.

●	Back-end: JavaScript (Node.js) com API RESTful
 Optou-se por JavaScript também no backend para manter a uniformidade da linguagem em toda a aplicação, facilitando o desenvolvimento e a manutenção por parte da equipe. A arquitetura baseada em API RESTful permite desacoplamento entre front-end e back-end, favorecendo futuras integrações e manutenções independentes.

●	Banco de dados: PostgreSQL
 O PostgreSQL foi selecionado por ser um banco relacional robusto, confiável e com suporte amplo a recursos avançados, como transações, integridade referencial e segurança, o que é fundamental para garantir a confiabilidade dos dados das RNCs. Sua capacidade de escalabilidade atende à expectativa de crescimento do sistema.

●	Conexão via APIs separadas por operação
 A divisão das operações (consulta, adição, edição) em endpoints REST específicos contribui para uma arquitetura limpa, modular e fácil de testar, além de garantir segurança e controle refinado sobre as ações do usuário.

Essa combinação tecnológica busca atender aos requisitos funcionais e não funcionais do sistema, assegurando uma solução eficiente, segura e com potencial de evolução, alinhada às melhores práticas da engenharia de software e às exigências da norma ISO 9001.


DESIGN, ARQUITETURA E MODELOS C4

Design escolhido:

Arquitetura modular com front-end separado do back-end, visando clareza de manutenção e escalabilidade.
Alternativas consideradas:

Desenvolvimento monolítico descartado por limitação de organização e escalabilidade.

Visão Inicial da Arquitetura:

Aplicação web com backend (API REST) + banco de dados relacional.

Padrões de Arquitetura:
Modelo MVC.

Modelos C4:
●	Contexto: Sistema acadêmico para controle de qualidade.
 
●	Contêineres: Frontend (Next.js), Backend (API Node.js), Banco de Dados (PostgreSQL).

●	Componentes: Tela de criação, consulta e edição; API REST.
 
●	Código: Organizado por camadas (controllers, services, models).
 
SEGURANÇA E PRÓXIMOS PASSOS


Considerações de Segurança:
●	Acesso restrito por autenticação (login básico ou token);
●	Proteção contra injeção de SQL com uso de ORM;
●	Validação de dados em formulários;
Próximos Passos: Portfólio I:
●	Levantamento detalhado de requisitos;
●	Modelagem do banco de dados;
●	Protótipo das interfaces;
●	Implementação inicial do CRUD de RNCs.
Portfólio II:
●	Finalização da interface e lógica de negócio;
●	Implementação das regras de segurança;
●	Testes e validações;
●	Documentação final e apresentação do TCC.
 
