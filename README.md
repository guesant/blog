# Portfolio

Site pessoal de Gabriel R. Antunes em Blazor (.NET 10), com conteúdo em SQLite e painel admin no próprio app.

## Desenvolvimento

```bash
just dev
```

Sobe o app em <http://localhost:8080> via Docker Compose, em SQLite. `just dev-postgres` sobe o mesmo app sobre um PostgreSQL local (`.docker/compose.postgres.yaml`), e `just db-update postgres` aplica as migrações nele. `just check` roda todos os portões de qualidade; `just format-fix` aplica a formatação. Convenções em [AGENTS.md](AGENTS.md), decisões e pendências em [docs/pendencias-e-decisoes.md](docs/pendencias-e-decisoes.md), schema do banco em [docs/database-schema.md](docs/database-schema.md).

## Produção

A cada push em `main`, o GitHub Actions roda os portões (`blazor-quality`) e publica a imagem `ghcr.io/guesant/portfolio` (`publish-image`). O deploy é `tools/scripts/deploy.sh`, que faz pull da tag `main` e sobe `.docker/compose.prod.yaml`. Migrações nunca rodam no deploy; use `just db-update` com backup antes. O banco é SQLite por padrão; `PORTFOLIO_DB_PROVIDER=postgres` com `PORTFOLIO_DB_CONNECTION` (e opcionalmente `PORTFOLIO_DB_READ_CONNECTION`) troca para PostgreSQL, detalhes em [docs/database-schema.md](docs/database-schema.md).

## Segurança e licença

Divulgação responsável em [SECURITY.md](SECURITY.md). Código sob MIT; o conteúdo editorial é licenciado à parte, conforme [REUSE.toml](REUSE.toml).
