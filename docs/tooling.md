# Tooling e proveniência

Os estágios actionlint, zizmor, Gitleaks, Trivy, uv e just e os presets
yamllint, Markdownlint e ast-grep têm origem no Lobby em
`089fc2754af91ba907663b0048960b3dffd2e646`. O Semgrep usa a mesma versão da
CLI, com regras fixadas em `16b9e6d45f10649f6a531ec4838ed9924372c3bc`. A regra
de pipefail veio do HL Infrastructure em `44f389124eb5524e9f0d5aebe9cf72cbb089872b`.

O Scorecard usa a action oficial fixada por SHA. Sua imagem interna
`v2.5.0` é a exceção registrada para preservar a publicação oficial.

Configure `RENOVATE_TOKEN` no environment `renovate` com um fine-grained PAT
restrito a este repositório. Execute o modo manual dry-run autenticado e confira
a extração antes de definir `RENOVATE_ENABLED=true` no mesmo environment.
O agendamento executa o bot depois dessa ativação. O PAT precisa de escrita
em Contents, Commit statuses, Issues, Pull requests e Workflows, além de
leitura dos alertas Dependabot. Faça a troca da abertura de PRs de segurança
depois do dry-run autenticado, mantendo os alertas do GitHub.

## Checagens locais

```sh
docker compose -f .docker/compose.yaml run --build --rm quality
docker compose -f .docker/compose.yaml run --build --rm semgrep
docker compose -f .docker/compose.yaml build hugo
docker image save --output .local/scan-image.tar guesant-blog-hugo:local
docker compose -f .docker/compose.yaml run --rm image-audit
```

Consulte os relatórios em `.local/reports`. O tar da imagem é uma entrada local
do scanner. No CI, o job de qualidade usa esses mesmos targets.

Bash e readline vêm do repositório oficial Alpine v3.24. Os arquivos
`.docker/bash-apks/*.sha256` registram as versões e os hashes dos pacotes
para AMD64 e ARM64. A instalação usa os APKs verificados com a rede
desabilitada no APK. O digest da base fixa os demais pacotes.

A regra de pipefail original verifica YAML de automação. A variante
`script-pipefail` aplica a mesma política aos pipelines em scripts Bash
próprios.

O build usa Hugo v0.169.0 por digest. A atualização substituiu o digest
anterior após a varredura da base. Os checksums dos APKs são revisados
em conjunto com suas versões ao atualizar a imagem.

Os estágios npm instalam cada ferramenta com o lockfile de
`.config/tooling/<ferramenta>`. O Docker reutiliza o cache de downloads entre
estágios. A imagem de qualidade reúne os executáveis desses estágios.
Os plugins do ESLint e as dependências do Vitest acompanham seus respectivos
executores.

A imagem da ferramenta pode ser executada pelo Compose. Por exemplo:

```sh
docker compose -f .docker/compose.yaml run --build --rm actionlint
docker compose -f .docker/compose.yaml run --build --rm scorecard
docker compose -f .docker/compose.yaml run --build --rm renovate --platform=local --dry-run=extract
```

O Scorecard local verifica o checkout. O workflow oficial separado publica
o resultado para o badge. O Dependency Review compara as revisões de cada
PR pelo Dependency Graph do GitHub.

O gate mantém os CycloneDX em `.local/reports` e o job de submissão
registra snapshots independentes para a aplicação e para cada lockfile
de tooling. Trivy bloqueia achados HIGH e CRITICAL da imagem de aplicação.
