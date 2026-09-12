# blog

Meu site pessoal, em Blazor (.NET 10). O conteúdo fica num PostgreSQL e é editado por um painel admin dentro do próprio app.

## Rodar

Precisa de Docker e [just](https://github.com/casey/just).

```bash
just dev
just db-update
```

Sobe em <http://localhost:8080>. `just check` roda os portões de qualidade, `just format-fix` formata. `just db-backup` grava um dump em `data/snapshots/`; `just db-restore <arquivo>` restaura.

## Deploy

Push em `main` roda os portões e publica a imagem em `ghcr.io/guesant/blog`. Como a imagem é orquestrada (Docker, Podman, k8s) fica fora do repositório: basta apontar `PORTFOLIO_DB_CONNECTION` para um PostgreSQL já migrado. Migração de banco nunca roda no start da imagem; é `just db-update`, com backup antes.

## Mais

- [AGENTS.md](AGENTS.md): convenções
- [docs/pendencias-e-decisoes.md](docs/pendencias-e-decisoes.md): decisões e pendências
- [docs/database-schema.md](docs/database-schema.md): banco
- [SECURITY.md](SECURITY.md): reportar vulnerabilidade

Código sob MIT. O conteúdo do site (textos, fotos, currículo) é meu e não entra na licença.
