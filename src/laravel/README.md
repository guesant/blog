# Laravel

Este diretório contém a API pública, o painel administrativo Filament e os
processos de geração de documentos do portfólio.

## Responsabilidades

O Laravel é a fonte de dados editoriais. A API entrega conteúdo localizado,
paginação, navegação, perfil, currículo, disponibilidade, metadados e arquivos
gerados. A interface pública é responsabilidade de `src/public-app`; o painel
administrativo é privado e contém somente as telas do Filament.

O contrato OpenAPI é exportado a partir das rotas e respostas com Scramble. A
referência Scalar, o documento OpenAPI e o Swagger UI são servidos pelas rotas
de documentação.

## Desenvolvimento

Os comandos são executados pelo `justfile` da raiz e dentro dos containers
definidos em `.docker/compose.yaml`:

```text
just dev
just laravel-check
just api-spec
```

O PostgreSQL local usa o volume `postgres-data`. Faça `just db-backup` antes de
qualquer migration ou outra operação de risco. O backup de produção é feito
com `just production-db-backup` antes de uma mudança de schema.

## Entrega

A imagem de produção é construída por `.github/workflows/publish-image.yml` a
partir de `docker/app.prod.Dockerfile`. O deploy é controlado pelos manifests
GitOps do repositório de infraestrutura. O runtime usa FrankenPHP e não
executa migrations durante o boot da aplicação.
