# Convenções deste repositório

Este arquivo é a fonte da verdade das convenções. `CLAUDE.md` e `GEMINI.md` são links simbólicos para ele; edite só aqui.

## Commits

- Conventional Commits: `<type>(<scope>): <título>`.
- Types permitidos: feat, fix, docs, style, refactor, perf, test, build, ci, chore.
- Só o título, sem body e sem footer. Sem co-autoria (`Co-Authored-By`) e sem qualquer trailer. O contexto detalhado vai em `docs/pendencias-e-decisoes.md`.
- Título em inglês, no imperativo, máximo 72 caracteres, sem ponto final.
- Tudo minúsculo, exceto nomes próprios, tokens e identificadores (ex.: `fix(admin): raise sortable handle hit area`).
- Commits atômicos: um assunto por commit; formatação em massa separada de mudanças de comportamento.
- Nunca commitar sem autorização explícita do dono do repositório na conversa, e nunca `--no-verify`.

## Código

- Zero comentários narrativos em YAML, TypeScript/JavaScript, CSS, PHP e shell. Um comentário só é aceitável em duas situações: é uma diretiva exigida por uma ferramenta, ou carrega informação rara e crítica que não é inferível do código e cuja ausência causaria um erro real no futuro, como um invariante de segurança ou um motivo não óbvio para uma decisão que parece removível.
- Para a segunda categoria o marcador é `IMPORTANT:`, sem exceção por julgamento caso a caso.
- Diretivas de ferramenta permitidas: `biome-ignore`, `nosemgrep`, `@ts-expect-error`, `@ts-ignore`, `@ts-nocheck`, `istanbul`, `jscpd:ignore-start`/`jscpd:ignore-end`, `zizmor: ignore[...]`, `shellcheck`, `yamllint`.
- Decisão, justificativa e contexto vão para `docs/pendencias-e-decisoes.md`, nunca inline.
- Toda medida em CSS passa por variáveis de tokens (nada de `px`/`rem` literais fora deles); conteúdo público é lido exclusivamente pela API Laravel; tudo sob `/admin` é privado por construção (middleware de autenticação e autorização do Filament).

## Formatação

- `just format` verifica e `just format-fix` aplica: Prettier (CSS, JS, TypeScript, JSON e Markdown, 100 colunas) e shfmt (shell, indent 2).
- Linhas longas, várias tags na mesma linha ou código que caberia em várias linhas não passam no gate; não contornar o formatador à mão.

## Qualidade

- `just check` é o gate completo: formatação, TypeScript, build, testes Laravel, supply chain e validação dos lockfiles. A CI roda o mesmo `just check`.
- Nunca rodar comandos que apaguem ou recriem o banco de desenvolvimento (volume `postgres-data`); ele contém conteúdo real. Faça `just db-backup` antes de qualquer operação de risco no banco.

## Documentação

- Um único documento de contexto: `docs/pendencias-e-decisoes.md` (pendências abertas, decisões tomadas e por quê).
- Sem travessão, meia-risca ou setas Unicode em docs; usar vírgula, frase separada, `>` ou `->`.

## Escrita de prosa

O guia abaixo vale para qualquer prosa, respostas no chat, documentação, README. Não vale para comentário de código, que é regido pela seção anterior.

# Escrita natural, aprofundada e editorial

## Objetivo

Produzir textos que se aproximem de uma escrita humana cuidadosa, especialmente textos explicativos, técnicos, argumentativos e analíticos. A prioridade não é parecer conciso, organizado ou escaneável a qualquer custo. A prioridade é desenvolver uma linha de raciocínio coerente, suficientemente aprofundada e natural.

O texto deve parecer escrito por alguém que conhece o assunto, pensou sobre ele e está tentando explicá-lo para outra pessoa, e não por um sistema tentando decompor cada ideia em pequenos blocos visualmente uniformes.

## Princípio central

Humanos não escrevem seguindo um molde perfeitamente regular. Um bom texto pode ter parágrafos de tamanhos diferentes, digressões necessárias, transições menos explícitas e explicações que ocupam várias frases antes de chegar a uma conclusão.

Não transforme automaticamente toda resposta em uma sequência de tópicos, passos, vantagens e desvantagens. Quando houver uma relação lógica contínua entre as ideias, prefira desenvolvê-las em prosa.

A estrutura deve surgir do conteúdo. O conteúdo não deve ser deformado para caber em uma estrutura predefinida.

## Desenvolvimento dos parágrafos

Prefira parágrafos substanciais. Uma ideia importante normalmente deve ser apresentada, contextualizada, explicada e relacionada às suas consequências antes que o texto avance para outro assunto.

Evite a sucessão de parágrafos com uma ou duas frases apenas para criar ritmo visual. Um novo parágrafo deve normalmente representar uma mudança real de foco, argumento, contexto ou etapa do raciocínio.

Não há necessidade de fazer todos os parágrafos longos. Frases ou parágrafos curtos podem existir quando possuem uma função retórica verdadeira, mas não devem constituir o padrão da resposta.

Quando uma afirmação depender de algum conceito anterior, explique esse conceito. Não presuma que o leitor conhece terminologia, convenções, contexto histórico ou detalhes de implementação apenas porque eles são comuns para especialistas da área.

Ao introduzir um termo técnico, explique o suficiente para que o restante do argumento possa ser acompanhado sem que o leitor precise interromper a leitura para pesquisar o significado.

## Continuidade do raciocínio

Evite tratar cada observação como uma unidade independente. Mostre como uma ideia conduz à seguinte.

Em vez de simplesmente enumerar fatos, desenvolva relações de causa, consequência, comparação e contexto. Explique por que determinada característica existe, que problema ela tenta resolver, quais efeitos colaterais produz e em quais circunstâncias ela deixa de ser vantajosa.

Quando houver controvérsia, tradeoff ou ambiguidade, preserve essa complexidade. Não reduza tudo a uma conclusão artificialmente simples apenas para encerrar o assunto rapidamente.

## Formatação

Use formatação com moderação.

Não utilize setas em caracteres Unicode ou ASCII como recurso habitual para representar progressão, equivalência, transformação ou causalidade. Escreva essas relações em linguagem natural.

Não utilize crases ou formatação monoespaçada como forma de destaque visual. Essa formatação deve ser reservada a situações em que exista realmente código, um comando, um caminho, um identificador técnico ou outro elemento que precise ser distinguido literalmente do restante da frase.

Evite travessões como recurso recorrente para inserir comentários laterais. Quando uma observação fizer parte do raciocínio, geralmente é melhor incorporá-la à própria construção da frase ou utilizar pontuação convencional.

Evite listas quando os itens formarem, na realidade, uma explicação contínua. Uma lista é apropriada quando existe uma coleção genuína de elementos independentes, uma sequência operacional, requisitos que precisam ser consultados individualmente ou outra situação em que a estrutura tabular ou enumerada melhora de maneira concreta a compreensão.

Não transforme uma resposta em lista apenas porque listas são mais fáceis de gerar ou escanear.

Evite títulos excessivos. Não crie uma nova seção para cada pequena mudança de assunto. Se duas partes pertencem ao mesmo argumento, mantenha-as dentro da mesma seção.

## Linguagem

Prefira linguagem direta, precisa e natural. O texto pode ser sofisticado sem ser rebuscado.

Não use frases promocionais, grandiosas ou excessivamente enfáticas para valorizar ideias comuns. Evite anunciar que determinada conclusão é especialmente importante, surpreendente, poderosa ou fundamental quando o próprio argumento pode demonstrar sua importância.

Evite bordões característicos de respostas artificiais, especialmente introduções que anunciam constantemente que algo será explicado de maneira simples, direta, objetiva ou definitiva.

Não repita a pergunta do usuário como introdução, a menos que isso seja necessário para esclarecer uma interpretação.

Não utilize continuamente construções simétricas apenas por efeito estilístico. Frases com a mesma extensão, parágrafos com a mesma estrutura e sequências repetidas de contraste tornam o texto excessivamente regular.

## Explicação para leitores não especialistas

Não confunda precisão com pressuposição de conhecimento.

Sempre que uma explicação depender de conhecimento que não apareceu anteriormente na conversa, avalie se esse conhecimento é realmente óbvio para o público esperado. Caso não seja, forneça o contexto necessário antes de utilizá-lo como premissa.

Isso não significa explicar conceitos elementares indiscriminadamente. O objetivo é evitar saltos lógicos.

Uma explicação técnica deve permitir que o leitor acompanhe o raciocínio mesmo quando ainda não domina completamente o assunto. O texto pode introduzir conceitos progressivamente, usando o conhecimento já estabelecido como base para os próximos.

Quando houver várias camadas de abstração, comece pelo modelo mental necessário para compreender o problema e avance gradualmente para os detalhes.

## Profundidade

Não confunda brevidade com clareza.

Quando a pergunta exigir explicação, explore também os motivos, implicações e limitações relevantes. Uma resposta que apenas informa o que fazer pode ser insuficiente se o usuário estiver tentando entender como o sistema funciona.

Em assuntos técnicos, procure explicar não apenas a configuração ou comportamento observado, mas também o mecanismo subjacente. Isso permite que o leitor transfira o conhecimento para situações diferentes daquela apresentada originalmente.

Evite, porém, adicionar conteúdo apenas para aumentar o tamanho do texto. Profundidade significa desenvolver aquilo que ajuda a compreender o assunto, não acumular informações periféricas.

## Naturalidade acima da uniformidade

Estas orientações não devem ser aplicadas mecanicamente.

Não alongue um parágrafo que naturalmente deveria ser curto apenas porque parágrafos longos são preferidos. Não elimine uma lista que claramente seja a melhor representação de uma sequência de comandos. Não evite um termo técnico correto apenas porque ele exige uma explicação adicional.

O objetivo final é impedir que hábitos de formatação e padrões recorrentes de respostas automáticas determinem a forma do texto.

A escrita deve parecer consequência do raciocínio, não consequência de um template.
