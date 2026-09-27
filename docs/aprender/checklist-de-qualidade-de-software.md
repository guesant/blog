# Checklist de qualidade de software

Um software de qualidade não é apenas um software que funciona no caminho feliz. Ele precisa produzir resultados corretos, proteger os dados, continuar operável sob falhas, responder dentro de limites aceitáveis e permanecer compreensível quando mudar de equipe, infraestrutura ou versão.

Este checklist organiza os controles que devem acompanhar o software desde a descoberta até a operação. Os limiares são pontos de partida. Cada sistema deve ajustá-los ao risco, ao custo de falha, ao volume, ao contrato com usuários e aos requisitos legais.

## Critérios de aceitação do produto

Antes de escrever código, registre o problema, o público afetado, as hipóteses, as restrições e a definição de sucesso. Uma funcionalidade só está pronta quando o comportamento esperado pode ser verificado e quando as consequências operacionais também foram consideradas.

- [ ] O problema e o usuário afetado estão descritos.
- [ ] O comportamento esperado está descrito com exemplos concretos.
- [ ] Os casos de sucesso, falha, ausência de dados e concorrência foram considerados.
- [ ] Requisitos funcionais e requisitos não funcionais estão separados.
- [ ] Dados pessoais, segredos, conteúdo sensível e retenção foram classificados.
- [ ] Dependências externas, limites de disponibilidade e custos foram registrados.
- [ ] Existe uma definição de pronto verificável.
- [ ] O responsável por aceitar o comportamento está identificado.

Requisitos não funcionais devem ser mensuráveis. "Rápido", por exemplo, precisa se transformar em um orçamento de latência por operação, com percentis e condições de carga. "Seguro" precisa se transformar em controles, evidências e cenários de ameaça.

## Definição de pronto

Uma mudança pode ser considerada pronta quando todos os itens aplicáveis abaixo possuem evidência. A ausência de um item deve ser uma decisão explícita, não uma omissão silenciosa.

- [ ] O código está revisado por outra pessoa ou por uma revisão equivalente.
- [ ] Testes unitários, de integração e de contrato cobrem os riscos da mudança.
- [ ] A entrada é validada no limite de confiança apropriado.
- [ ] A autorização é verificada para cada operação protegida.
- [ ] O caminho de erro possui resposta, log e métrica adequados.
- [ ] Linter, formatter, type checker e análise estática passam.
- [ ] A documentação de uso, operação e configuração foi atualizada.
- [ ] A migração é compatível com a estratégia de rollout e rollback.
- [ ] O monitoramento foi atualizado quando novos riscos ou sinais foram introduzidos.
- [ ] O artefato produzido é rastreável ao commit e às dependências usadas.

## Fluxo de dados

O fluxo de dados deve ser analisado de ponta a ponta. A mesma entrada pode atravessar navegador, proxy, aplicação, fila, banco, cache, serviço externo e logs. Cada fronteira precisa declarar o que valida, transforma, armazena, expõe e registra.

### Entrada

- [ ] A origem da entrada está identificada.
- [ ] O esquema, o tipo, o tamanho e os limites são validados.
- [ ] Strings, URLs, caminhos, identificadores e datas são normalizados conforme o domínio.
- [ ] O sistema rejeita campos desconhecidos quando isso evita ambiguidade.
- [ ] Uploads verificam tamanho, tipo declarado, tipo detectado, nome e conteúdo.
- [ ] JSON, XML, CSV, imagens e arquivos compactados têm limites contra consumo abusivo.
- [ ] A validação não substitui a autorização.
- [ ] O sistema não monta SQL, comandos, expressões, HTML ou caminhos usando concatenação insegura.

### Processamento

- [ ] A operação identifica o usuário, o tenant e o contexto de segurança.
- [ ] As regras de negócio são aplicadas em um ponto único e testável.
- [ ] O sistema impede repetição indevida com idempotency key, constraint ou deduplicação.
- [ ] Transações delimitam exatamente o conjunto de alterações que precisa ser atômico.
- [ ] Chamadas externas possuem timeout, retry limitado, backoff e circuit breaker quando aplicável.
- [ ] O código define o comportamento para resposta parcial, atraso, duplicação e indisponibilidade.
- [ ] Operações assíncronas informam o estado ao usuário e possuem correlação com a requisição original.

### Persistência e saída

- [ ] O modelo preserva invariantes no banco, não apenas na aplicação.
- [ ] Índices atendem às consultas reais e não são criados sem medir custo de escrita e armazenamento.
- [ ] Campos retornados são selecionados explicitamente.
- [ ] Paginação, ordenação e limites são determinísticos.
- [ ] Respostas não vazam campos internos, segredos, identificadores desnecessários ou mensagens de infraestrutura.
- [ ] Datas têm semântica definida, incluindo timezone e precisão.
- [ ] Eventos, jobs e efeitos externos são publicados de maneira segura contra perda ou duplicação.
- [ ] O cache possui chave, validade, invalidação, limite e comportamento para falha.

## Testes

Cobertura de linhas não é sinônimo de cobertura de risco. O número precisa ser combinado com cobertura de branches, mutação, contratos, cenários críticos e análise dos testes que falharam no passado.

### Testes unitários

- [ ] Regras puras, validações e transformações têm testes rápidos.
- [ ] Casos de borda incluem coleção vazia, limite mínimo, limite máximo, nulo e valores inválidos.
- [ ] Erros esperados são verificados, não apenas o caminho de sucesso.
- [ ] Datas, aleatoriedade, rede e relógio são controláveis no teste.
- [ ] Os testes não dependem de ordem global nem de estado compartilhado.
- [ ] Mocks não substituem a verificação da regra que deveria ser testada.

### Testes de integração

- [ ] Repositórios, transações, constraints, filas e caches são testados contra serviços reais ou equivalentes confiáveis.
- [ ] O comportamento de rollback é verificado.
- [ ] O sistema é testado com timeouts, erros de rede, dados duplicados e respostas incompletas.
- [ ] As migrações são aplicadas em uma base vazia e em uma base representativa.
- [ ] Índices e consultas críticas são exercitados com volume suficiente para revelar planos ruins.

### Testes de contrato

- [ ] O contrato HTTP ou de mensagens tem schema versionado.
- [ ] Consumidores verificam campos obrigatórios, opcionais, enums, paginação e erros.
- [ ] Mudanças incompatíveis falham no CI antes do deploy.
- [ ] O contrato inclui autenticação, autorização, limites e códigos de status relevantes.
- [ ] OpenAPI, schemas de eventos e clientes gerados são regenerados a partir da fonte correta.

### Testes de interface e jornada

- [ ] As rotas principais funcionam por acesso direto e navegação interna.
- [ ] SSR, hidratação, loading, erro e revalidação são testados separadamente.
- [ ] Dados anteriores permanecem visíveis durante revalidação quando a UX exigir isso.
- [ ] Teclado, leitor de tela, foco, contraste, zoom e viewport estreito são cobertos.
- [ ] Estados vazios e falhas de API têm mensagens acionáveis.
- [ ] Não há loading infinito sem timeout, fallback ou mensagem de erro.

### Testes de propriedade e mutação

- [ ] Invariantes são expressas como propriedades para entradas variadas.
- [ ] Testes de mutação medem se as asserções detectam alterações relevantes.
- [ ] Fuzzing é usado em parsers, serializadores, autenticação, protocolos e entradas públicas.
- [ ] Casos reproduzidos de incidentes permanecem como testes de regressão.

### Metas de cobertura

Use metas diferentes para código de risco diferente. Como referência inicial:

| Medida | Uso | Interpretação |
| --- | --- | --- |
| Linhas | localizar código nunca executado | indicador básico, insuficiente sozinho |
| Funções | verificar operações não exercitadas | útil para módulos pequenos |
| Branches | testar decisões e erros | melhor indicador para regras condicionais |
| Condições | testar combinações booleanas | necessário em regras de autorização e validação |
| Mutação | medir força das asserções | detecta testes que executam sem verificar |
| Casos críticos | proteger fluxos de maior risco | deve ser 100% coberto por cenário aplicável |

Uma política razoável é exigir cobertura de branches crescente nos módulos novos, impedir regressão em relação à base atual e exigir testes específicos para autenticação, dinheiro, dados pessoais, migrações, autorização e idempotência. A métrica não deve ser aumentada com testes artificiais que não verificam comportamento.

## Análise estática

Análise estática deve cobrir código, dependências, configuração, infraestrutura e o fluxo de dados. Ferramentas diferentes encontram classes diferentes de defeito.

### Linter

- [ ] O linter cobre todas as linguagens mantidas.
- [ ] Regras de erro são bloqueantes no CI.
- [ ] Regras de estilo não escondem regras de segurança.
- [ ] Imports, dependências, nomes, complexidade e padrões proibidos são verificados.
- [ ] Regras arquiteturais impedem dependências entre camadas incompatíveis.
- [ ] Exceções são locais, justificadas e auditáveis.
- [ ] Código gerado, vendor e fixtures são excluídos apenas quando a exclusão é intencional.

### Formatter

- [ ] O formatter é determinístico e executado no CI.
- [ ] Existe uma única configuração por linguagem ou uma hierarquia explícita.
- [ ] O gate usa modo de verificação, sem reescrever silenciosamente o código.
- [ ] Arquivos gerados têm política definida.
- [ ] A formatação ocorre antes de comparar duplicação, para reduzir ruído.

### Tipos e contratos internos

- [ ] TypeScript, PHPStan, Psalm ou equivalentes rodam em nível definido.
- [ ] Tipos de entrada e saída atravessam as fronteiras da aplicação.
- [ ] Valores opcionais, nulos e estados incompletos são modelados.
- [ ] O código não depende de casts indiscriminados para silenciar o compilador.
- [ ] Tipos gerados são atualizados a partir do contrato, nunca editados manualmente.

### Complexidade e manutenção

- [ ] Complexidade ciclomática possui limite por função ou módulo.
- [ ] Complexidade cognitiva é revisada em funções difíceis de ler.
- [ ] Profundidade de aninhamento, tamanho de função e tamanho de arquivo são monitorados.
- [ ] Código morto, exports não usados e dependências órfãs são detectados.
- [ ] Duplicação textual e duplicação estrutural têm gates separados.
- [ ] Mudanças de tipo 4, com mesma finalidade e implementação diferente, são revisadas semanticamente.

## SAST

SAST deve analisar o código sem executá-lo e também acompanhar o fluxo de dados. O conjunto mínimo varia por linguagem, mas deve incluir:

- [ ] SQL injection, incluindo queries construídas por interpolação.
- [ ] XSS, template injection e saída HTML insegura.
- [ ] Command injection, path traversal e uso inseguro de arquivos.
- [ ] SSRF, open redirect e validação de URL.
- [ ] Desserialização insegura, expressão dinâmica e execução de código.
- [ ] Segredos, tokens, chaves privadas e credenciais no repositório.
- [ ] Criptografia fraca, nonce repetido, hash inadequado e comparação insegura.
- [ ] Autorização ausente, IDOR e confiança indevida em dados do cliente.
- [ ] Uso inseguro de APIs de framework e configurações perigosas.
- [ ] Taint analysis de origem, propagação, sanitização e sink.

Combine scanner geral, regras do framework e regras locais. Em Laravel, por exemplo, PHPStan com plugin Laravel ajuda com tipos e Eloquent, Psalm com plugin e taint analysis cobre fluxos de dados, e Semgrep pode impor APIs proibidas e fronteiras arquiteturais. A ferramenta não substitui revisão de ameaça nem teste dinâmico.

## Dependências e supply chain

- [ ] Dependências diretas e transitivas estão lockadas.
- [ ] O CI verifica integridade dos lockfiles.
- [ ] Vulnerabilidades são triadas por explorabilidade, alcance e versão corrigida.
- [ ] Licenças são inventariadas.
- [ ] Imagens base e binários são fixados por digest quando apropriado.
- [ ] O SBOM é gerado para os artefatos publicados.
- [ ] Proveniência, assinatura e reprodutibilidade são verificadas conforme o risco.
- [ ] Renovação de dependências ocorre em fluxo automatizado e revisável.
- [ ] Ferramentas de build e actions de CI são pinadas e analisadas.
- [ ] Artefatos não são baixados de fontes sem validação de checksum ou assinatura.

## DAST e segurança dinâmica

DAST examina o sistema em execução. O ambiente de teste deve ser isolado e conter dados não produtivos.

- [ ] As rotas públicas são descobertas e testadas.
- [ ] Autenticação, expiração de sessão, logout e refresh token são testados.
- [ ] Autorização é testada com usuários, tenants e papéis diferentes.
- [ ] Entradas são testadas com payloads de XSS, injection, traversal e SSRF.
- [ ] CORS, CSRF, cookies, headers de segurança e TLS são verificados.
- [ ] Rate limiting, tamanho de requisição e limites de paginação são exercitados.
- [ ] APIs recebem fuzzing orientado por schema.
- [ ] Uploads, webhooks e callbacks são testados contra replay e falsificação.
- [ ] Scanning autenticado cobre telas e endpoints protegidos.
- [ ] Achados têm severidade, evidência, responsável, prazo e reteste.

DAST não enxerga todos os caminhos internos e pode produzir falsos positivos. Por isso deve ser combinado com SAST, SCA, revisão manual e testes de autorização.

## Infraestrutura e configuração

- [ ] Manifestos Kubernetes e arquivos de infraestrutura passam por validação sintática.
- [ ] Schemas, políticas, security contexts e recursos obrigatórios são verificados.
- [ ] Imagens não executam como root sem justificativa.
- [ ] Capabilities são reduzidas e filesystem pode ser somente leitura quando possível.
- [ ] NetworkPolicy, RBAC, secrets, probes e limites são verificados.
- [ ] Terraform ou OpenTofu detecta drift e mudanças destrutivas.
- [ ] Configurações de produção não ficam em valores locais ocultos.
- [ ] Secrets são gerenciados fora do código e possuem rotação documentada.
- [ ] Backups, restauração e retenção são testados, não apenas configurados.
- [ ] Configuração de observabilidade existe junto do workload.

## Performance

Performance deve ser tratada como requisito observável. Uma média baixa pode esconder usuários lentos, filas longas ou caudas de latência muito altas.

- [ ] Existem budgets para tempo de resposta, tamanho de payload, JavaScript, consultas e consumo de memória.
- [ ] P50, P95 e P99 são medidos por rota e operação importante.
- [ ] A medição separa DNS, conexão, TLS, fila, aplicação, banco e dependências externas.
- [ ] O benchmark representa dados, concorrência e distribuição de uso reais.
- [ ] O teste de carga verifica capacidade sustentada.
- [ ] O teste de stress verifica degradação e recuperação além da capacidade.
- [ ] O teste de soak verifica vazamentos e degradação prolongada.
- [ ] O teste de spike verifica mudanças bruscas de demanda.
- [ ] O banco é medido com plano de execução, cardinalidade, locks, I/O e cache hit.
- [ ] N+1, selects excessivos, colunas desnecessárias e ausência de limites são detectados.
- [ ] CPU, memória, garbage collector, event loop, filas e conexões são perfilados.
- [ ] O perfil de produção usa amostragem e proteção de dados sensíveis.
- [ ] Melhorias são comparadas com uma baseline antes de serem aceitas.

Profiling deve responder onde o tempo e o recurso são consumidos. Use flame graphs, sampling profiler, heap profile, tracing, métricas de banco e análise de eventos. Não conclua que o frontend é lento sem separar SSR, API, banco, rede e hidratação.

## Confiabilidade e resiliência

- [ ] Cada dependência possui timeout explícito.
- [ ] Retries têm limite, backoff e jitter.
- [ ] Retries só ocorrem quando a operação é segura ou idempotente.
- [ ] Circuit breaker impede avalanche para dependência indisponível.
- [ ] Fallback não retorna dados incorretos como se fossem atuais.
- [ ] Filas têm limite de concorrência, capacidade, retenção e dead letter.
- [ ] Jobs são reprocessáveis e possuem idempotência.
- [ ] Falhas parciais são visíveis ao usuário e à operação.
- [ ] Rollout pode ser interrompido e revertido.
- [ ] O sistema possui graceful shutdown e draining.
- [ ] Falhas comuns são reproduzíveis em teste ou exercício controlado.

## Observabilidade

- [ ] Logs estruturados têm timestamp, serviço, ambiente, versão e correlation ID.
- [ ] Dados pessoais e segredos não aparecem nos logs.
- [ ] Métricas cobrem tráfego, erros, duração e saturação.
- [ ] Métricas de negócio distinguem falha técnica de ausência legítima de conteúdo.
- [ ] Traces atravessam HTTP, filas, banco e serviços externos quando necessário.
- [ ] Dashboards respondem às perguntas de operação mais importantes.
- [ ] Alertas são acionáveis e apontam para runbook.
- [ ] Alertas têm limiar, janela, severidade, owner e política de silenciamento.
- [ ] Existe alerta para crescimento de erros, saturação, fila, expiração e falha de backup.
- [ ] O sistema permite correlacionar usuário, requisição, job e evento sem expor dados sensíveis.

## Banco de dados e migrações

- [ ] Toda migração pode ser executada em ambiente vazio.
- [ ] A migração é compatível com o código anterior durante o rollout quando necessário.
- [ ] Alterações pesadas são separadas de deploy urgente.
- [ ] Defaults, constraints, índices e backfills consideram lock e volume.
- [ ] Operações de longa duração têm estratégia online ou janela controlada.
- [ ] O plano de rollback é conhecido antes da execução.
- [ ] Backup é feito antes de operação de risco e a restauração é verificada.
- [ ] WAL, espaço em disco, replicação e checkpoints são monitorados.
- [ ] Dados antigos são removidos somente após retenção, backup e confirmação de uso.
- [ ] Migrações consumidas só são removidas quando há evidência de execução em produção e política de histórico permite isso.

## Manutenção

- [ ] Dependências, runtime, imagem base e ferramentas possuem ciclo de atualização.
- [ ] O projeto acompanha CVEs e versões suportadas.
- [ ] Há procedimento para revogar credenciais e rotacionar secrets.
- [ ] Há procedimento para restaurar banco, arquivos, filas e configuração.
- [ ] Jobs recorrentes possuem owner, agenda, timeout, retry e observabilidade.
- [ ] Feature flags têm owner, data de remoção e comportamento padrão seguro.
- [ ] Código legado possui decisão documentada de manter, migrar ou remover.
- [ ] Dívida técnica é registrada com impacto e prioridade.
- [ ] Logs, tabelas, buckets, caches e artefatos possuem retenção.
- [ ] O suporte consegue diagnosticar sem acesso direto a dados desnecessários.

## Deploy e release

- [ ] O artefato é imutável e identificável por versão ou digest.
- [ ] O build é reproduzível ou possui justificativa para as partes não reproduzíveis.
- [ ] O pipeline executa gates antes de publicar.
- [ ] O ambiente de staging se aproxima de produção nas propriedades relevantes.
- [ ] O rollout é canary, blue-green, rolling ou equivalente conforme o risco.
- [ ] Health checks distinguem startup, readiness e liveness.
- [ ] A promoção verifica métricas e não apenas o status do processo.
- [ ] Existe rollback testado.
- [ ] Alterações de banco têm ordem de aplicação documentada.
- [ ] O changelog informa incompatibilidades, migrações e ações operacionais.

## Gates de CI

Um pipeline deve ser composto por gates pequenos, determinísticos e relacionados a uma decisão. Um exemplo de conjunto mínimo é:

1. Verificar formato, YAML, JSON, schemas e arquivos gerados.
2. Executar linters, regras arquiteturais, type checkers e análise de código morto.
3. Executar SAST, secret scanning, SCA e validações de infraestrutura.
4. Executar testes unitários e de integração com relatórios de cobertura.
5. Verificar contratos de API, eventos e migrações.
6. Construir os artefatos em ambiente limpo.
7. Gerar SBOM, checksum, assinatura e metadados de proveniência.
8. Executar DAST, smoke tests e testes autenticados no ambiente efêmero.
9. Publicar somente se todos os gates bloqueantes passarem.

Gates informativos também são úteis, mas devem ser claramente marcados. Não transforme um resultado obrigatório em aviso para manter o pipeline verde. Quando uma exceção for necessária, ela deve ter escopo, justificativa, responsável, prazo e teste compensatório.

## Relatórios e evidências

Para cada execução importante, preserve os artefatos necessários para reconstruir a decisão:

- versão do código e do pipeline;
- versão das ferramentas;
- resultado dos testes e cobertura;
- relatório SAST, DAST, SCA e secret scanning;
- SBOM e provenance;
- métricas de benchmark e configuração de carga;
- plano de migração e resultado de smoke test;
- exceções ativas e seus vencimentos;
- logs de promoção, rollback e incidentes.

## Checklist antes de publicar

- [ ] A mudança resolve o problema original e não apenas o sintoma.
- [ ] Os dados exibidos continuam corretos em cache hit, cache miss, erro e revalidação.
- [ ] Os fluxos públicos e privados foram separados.
- [ ] Não há endpoint público expondo dados ocultos ou administrativos.
- [ ] Os testes cobrem o caminho principal e as falhas previsíveis.
- [ ] O custo de CPU, memória, rede, armazenamento e banco foi considerado.
- [ ] O release pode ser observado, interrompido e revertido.
- [ ] A documentação e os runbooks estão atualizados.
- [ ] O owner sabe o que mudou e como responder a uma falha.

## Checklist depois de publicar

- [ ] Smoke tests confirmam as rotas críticas.
- [ ] Logs não mostram aumento inesperado de erros.
- [ ] P95 e P99 permanecem dentro do budget.
- [ ] CPU, memória, filas, conexões e locks estão normais.
- [ ] Não houve aumento de respostas vazias, timeouts ou retries.
- [ ] A versão está identificável nos sinais de observabilidade.
- [ ] Backups e jobs continuam executando.
- [ ] A decisão de manter, promover ou reverter foi registrada.

## Revisão periódica

Qualidade se degrada quando o sistema muda e os controles ficam parados. Revise mensalmente ou no intervalo definido pelo risco:

- cobertura e testes flakey;
- vulnerabilidades abertas e exceções vencidas;
- dependências fora de suporte;
- latência e consumo em relação à baseline;
- incidentes e quase incidentes;
- alertas sem ação;
- rotinas de backup e restauração;
- migrações ainda necessárias;
- código morto, duplicação e complexidade;
- documentação desatualizada;
- gaps de acessibilidade e experiência.

O objetivo do checklist não é criar burocracia. É tornar explícito o que precisa ser verificado para que uma decisão de engenharia seja segura, repetível e reversível.
