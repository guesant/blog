# Pendências e decisões

Registro único de decisões tomadas (com o porquê) e pendências abertas. Commits carregam só o título; o contexto vive aqui.

## Decisões

- Rotas públicas de detalhe usam `{publicId}-{slug}`: o id de 6 hex identifica o item e o slug é decorativo, então renomear um slug não quebra links; slugs antigos continuam resolvendo.
- `/writing`, `/findings` e `/collections` são o feed da home com o tipo fixado pela rota, para que "limpar filtros" mantenha o visitante na seção escolhida.
- CSharpier é o único formatador de C#; `dotnet format whitespace` saiu das receitas por brigar com ele (blocos de uma linha e `for` aninhados).
- Ordem de exibição (`Order`) é editada por arrastar na tela `/admin/<entidade>/order`, não campo a campo; itens novos entram no fim.
- Toda listagem pública (home, tópicos, tecnologias, snippets, cases, projetos, experimentos, créditos, ferramentas) usa o mesmo card editorial `SiteFeedCard` e a mesma barra `[ordenar] [busca][limpar][aplicar]` via `SiteListingFilterBar`; a barra só de ordenação foi removida para não haver duas estéticas.
- Campos de texto livre com vocabulário conhecido no admin (plataforma de contato e de link, propósito, linguagem de arquivo, proficiência, estado editorial, visibilidade) usam `SiteSelectWithCustom`: select com os valores padrão mais a opção "other (custom)", que é a única que libera o input livre. Qualquer valor já salvo fora da lista aparece como custom, nunca é descartado.
- Slots de componentes não podem se chamar `Meta` (nem outro nome de elemento void do HTML): o Razor exige que sejam auto-fechados. O slot do `SiteFeedCard` chama-se `MetaItems` por isso.
- No `SiteSelect` o botão de limpar fica à esquerda do chevron, que não muda de lugar; a reserva de espaço é feita por margem no valor, não por padding no trigger.

- A imagem de produção é construída pelo `Dockerfile` da raiz (SDK e runtime `aspnet` pinados por digest, usuário `app` sem privilégio, `entrypoint.prod.sh` que recusa subir sem banco) e publicada em `ghcr.io/guesant/portfolio` pelo workflow `publish-image` a cada push na `main`, com as tags `main`, `sha-<commit>` e `latest`. O `.docker/app.prod.Dockerfile` antigo foi absorvido por ele.
- Deploy é por pull da imagem (`tools/scripts/deploy.sh`), sem webhook nem acesso ao socket do Docker por um listener HTTP. O webhook do GitLab, o `.gitlab-ci.yml` e o `WEBHOOK_SECRET` saíram junto com a migração para o GitHub.
- A imagem nunca aplica migrações EF no start: essa é uma decisão anterior (README e `entrypoint.prod.sh`), mantida. Schema muda por `just db-update`, com backup antes.
- O picker de itens da coleção continua fora do `SiteEntityChecklist` porque ali a ordem dos itens é dado salvo (`Order` por índice) e cada item carrega uma nota; o checklist trabalha com conjunto sem ordem.
- A `main` foi recriada como branch órfã com um único commit em 2026-09-10; a história anterior (Laravel e migração) ficou no GitLab e no branch local `backup/main-gitlab`. A origin passou a ser `https://github.com/guesant/portfolio.git`.

- O C# dos componentes vive em `.razor.cs` (partial class com o mesmo nome e namespace do `.razor`), não em blocos `@code`: só assim o CSharpier e os analisadores (CA1822, CA1816 etc.) alcançam esse código. A única exceção é `SiteFormField.razor`, cujo `@code` guarda um template razor (`@<text>`), que não existe em C# puro. Os `@using` de cada `_Imports.razor` foram espelhados como `<Using>` globais no csproj, para os `.razor.cs` não repetirem o mesmo cabeçalho de imports (o jscpd apontava isso como clone). Os scripts `format-csharp-*.mjs` passaram a tratar só `.razor`, para não brigar com o CSharpier nos `.cs`. Em `X.stories.razor` a classe gerada chama-se `X_stories`, então o CA1707 fica desligado para esses arquivos.
- `just stories` roda com `dotnet watch` (polling). Edições em arquivos já vigiados reiniciam sozinhas; um arquivo novo só entra na próxima reavaliação do projeto, então `just stories-refresh` (toca o `_Imports.razor`) força isso sem reiniciar o container.
- A sidebar do admin divergia da do site em um ponto real: os links do admin não tinham a regra `justify-content: flex-start` que a sidebar do site aplica aos `.sidebar-action`, então o texto ficava centralizado dentro do pill, e a marca "Admin" usava o corpo (14px) em vez do `--site-text-2xl` da marca do site. As duas regras entraram no `SiteAdminShell.razor.css`; largura (16rem), padding, gaps, altura dos itens (32px), fonte dos itens (14px) e rótulos de grupo já eram os mesmos tokens. Verificado na story `Templates/SiteAdminShell`, que agora renderiza uma navegação real em vez de um placeholder.

## Pendências

Nenhuma no momento.
