# Documento de Requisitos de Software (SRS)

## Projeto: Gerenciador de Racha (Society)

**Objetivo:** Plataforma web/mobile para organização financeira, técnica e estatística de partidas de futebol society amador.

---

## 1. Atores do Sistema (Perfis de Usuário)

**Administrador (Owner):** Criador do evento. Possui permissão total sobre o racha, incluindo gestão financeira, gestão de participantes e controle do jogo.

**Moderador (Staff):** Jogador promovido pelo Administrador. Possui permissão para gerenciar o cronômetro e registrar eventos da partida.

**Jogador:** Usuário participante do racha. Pode confirmar presença, votar nos sorteios de times e visualizar suas estatísticas.

**Espectador (Público):** Qualquer pessoa com o link da partida. Pode apenas visualizar o placar, o tempo e os eventos em tempo real, sem necessidade de autenticação.

**Sistema de Pagamento (Externo) – opcional:** Sistema externo responsável por confirmar pagamentos via Pix, em caso de integração futura.

---

## 2. Requisitos Funcionais (O que o sistema faz)

### 2.1. Gestão do Evento (Lobby)

**[RF01] Criar Racha:** O sistema deve permitir a criação de um evento contendo local, data/horário, valor por pessoa e chave Pix.

**[RF02] Lista de Presença:** Jogadores devem poder confirmar presença no evento.

**[RF03] Gestão Financeira:**

* Exibir chave Pix com botão de copiar.
* Exibir status de pagamento ao lado de cada jogador (Pendente/Pago).
* Permitir ao Administrador alterar manualmente o status para "Pago".

**[RF04] Gestão de Moderadores:** O Administrador deve poder promover jogadores confirmados para a função de Moderador.

**[RF12] Cancelamento de Presença:** O jogador deve poder remover sua confirmação de presença antes do início da partida.

**[RF13] Encerramento do Evento:** O Administrador deve poder encerrar manualmente o evento após o término da partida, bloqueando novas ações.

---

### 2.2. Formação de Times

**[RF05] Sorteio Automático:** O sistema deve gerar três opções de divisão de times com base no score (habilidade) e/ou posição dos jogadores confirmados.

**[RF06] Votação de Times:** Os jogadores confirmados devem poder votar em uma das opções de sorteio. A opção mais votada define os times oficiais.

**[RF14] Confirmação Final de Times:** Após o encerramento da votação, o Administrador deve confirmar os times antes do início da partida.

---

### 2.3. A Partida (Modo Live)

**[RF07] Cronômetro de Jogo:** Sistema de contagem regressiva visível apenas para Administradores e Moderadores.

**[RF08] Registro de Eventos:** Moderadores devem poder registrar gols vinculados a um jogador e ao tempo atual da partida.

**[RF09] Visualização Pública:** Interface acessível por link externo que exibe placar, tempo de jogo e timeline de eventos em tempo real.

**[RF15] Edição/Remoção de Eventos:** Moderadores devem poder editar ou remover eventos registrados incorretamente durante a partida.

**[RF16] Indicação Visual do Estado do Jogo:** O sistema deve indicar claramente os estados: aguardando início, em andamento, acréscimo e encerrado.

---

### 2.4. Estatísticas e Gamificação

**[RF10] Perfil do Jogador:** Exibir foto, posição preferida e histórico de participação.

**[RF11] Dashboard Individual:** Exibir estatísticas acumuladas como gols totais, vitórias, jogos disputados e score atual.

**[RF17] Histórico de Partidas:** O jogador deve poder visualizar o histórico das partidas disputadas, contendo placar final e desempenho individual.

---

## 3. Regras de Negócio (Lógica Específica)

**[RN01] Duração da Partida:** O tempo padrão da partida é de 7 minutos corridos.

**[RN02] Regra do Acréscimo (Morte Súbita):** Ao atingir 00:00, o cronômetro entra em estado de acréscimo e o jogo só encerra quando o Moderador acionar o comando de fim de jogo.

**[RN03] Cálculo de Score:** O score do jogador deve ser recalculado ao final de cada partida com base em critérios definidos, como vitórias, derrotas e gols.

**[RN04] Controle de Acesso ao Cronômetro:** Apenas Administradores ou Moderadores associados ao evento podem iniciar, pausar ou encerrar o cronômetro e registrar eventos.

**[RN05] Votação Condicionada à Presença:** Apenas jogadores confirmados na lista de presença podem votar no sorteio de times.

**[RN06] Registro de Gols Condicionado ao Estado do Jogo:** Eventos só podem ser registrados quando o jogo estiver em andamento ou em acréscimo.

**[RN07] Imutabilidade Pós-Encerramento:** Após o encerramento do evento, não devem ser permitidas alterações em placar, eventos ou times.

---

## 4. Requisitos Não-Funcionais (Critérios de Qualidade)

**[RNF01] Plataforma:** O sistema deve ser implementado como um PWA, instalável e responsivo, priorizando abordagem mobile-first.

**[RNF02] Tempo Real:** Atualizações de placar, cronômetro e votação devem ocorrer em tempo real via WebSocket.

**[RNF03] Interface:** O design deve priorizar o uso de Dark Mode para melhor conforto visual em ambientes noturnos.

**[RNF04] Disponibilidade:** O sistema deve suportar conexões instáveis utilizando Optimistic UI.

**[RNF05] Segurança:** O sistema deve utilizar autenticação segura baseada em tokens e controle de acesso por roles associadas ao evento.

**[RNF06] Performance:** Atualizações em tempo real devem ser refletidas para todos os clientes em até 2 segundos.

**[RNF07] Confiabilidade:** Em caso de queda de conexão, o estado atual do jogo deve ser restaurado automaticamente após reconexão.

---

## 5. Stack Tecnológica Sugerida

**Frontend:** React.js (Next.js) com Tailwind CSS.

**Backend / BaaS:** Supabase (PostgreSQL, autenticação e subscriptions em tempo real).

**Hospedagem:** Vercel.

---

## 6. Restrições e Premissas

* O sistema não substitui arbitragem oficial.
* As estatísticas dependem exclusivamente dos eventos registrados manualmente.
* A sincronização em tempo real depende de conexão com a internet.

---

## 7. Critérios de Aceitação (Exemplos)

* Deve ser possível criar um evento em menos de 1 minuto.
* Um gol registrado deve refletir no placar público em tempo real.
* Um espectador deve acessar a visualização pública sem autenticação.
