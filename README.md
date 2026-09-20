# blog

Meu site pessoal, com frontend em TanStack Start e API mais painel administrativo em Laravel. O conteúdo fica num PostgreSQL e é editado pelo Filament.

## Rodar

Precisa de Docker e [just](https://github.com/casey/just).

```bash
just dev
just db-update
```

Sobe em <http://localhost:8080>. `just check` roda os portões de qualidade, `just format-fix` formata. `just db-backup` grava um dump em `data/snapshots/`; `just db-restore <arquivo>` restaura.

## Deploy

Push em `main` roda os portões e publica a imagem do frontend em `ghcr.io/guesant/portfolio`; a imagem Laravel é publicada separadamente. Como as imagens são orquestradas fora do repositório, basta apontar as variáveis do Laravel para um PostgreSQL já migrado. Migração de banco nunca roda no start do processo web: o Job `PreSync` usa `php artisan migrate --force` na imagem Laravel; localmente é `just db-update`, com backup antes.

## Mais

- [AGENTS.md](AGENTS.md): convenções
- [docs/pendencias-e-decisoes.md](docs/pendencias-e-decisoes.md): decisões e pendências
- [docs/database-schema.md](docs/database-schema.md): banco
- [SECURITY.md](SECURITY.md): reportar vulnerabilidade

Código sob MIT. O conteúdo do site (textos, fotos, currículo) é meu e não entra na licença.
