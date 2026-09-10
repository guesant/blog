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

## Pendências

- Blocos `@code` em `.razor` não são refluídos por nenhum formatador; mover para `.razor.cs` (partial classes) resolveria via CSharpier.
- O container das Stories não recarrega componentes novos sem reiniciar.
- Conferir no admin autenticado por que a sidebar parece maior que a do site; por CSS, fonte, altura dos itens, largura e padding são os mesmos tokens.
