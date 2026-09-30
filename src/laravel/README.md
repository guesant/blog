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

## Media assets

Anexos inseridos pelo MarkdownEditor são armazenados no disco privado configurado para a aplicação e registrados em `media_assets`. O catálogo mantém o disco, o caminho, o tipo MIME, o tamanho, o checksum e a visibilidade do arquivo.

As respostas públicas só transformam anexos catalogados como `public` em URLs assinadas. A assinatura inclui o disco, o caminho e a expiração, e a aplicação aceita temporariamente a chave anterior durante uma rotação. O endpoint retorna `404` para arquivos inexistentes, privados, não catalogados, expirados ou com assinatura inválida. A resposta usa `Content-Disposition: attachment` e `X-Content-Type-Options: nosniff`, portanto o navegador não recebe anexos para renderização inline.

O preview de anexos no Filament usa uma rota autenticada do painel. O endereço interno do storage nunca é enviado ao navegador como URL pública.

Depois de aplicar a migration, o backfill deve ser executado primeiro em modo de simulação e depois de forma efetiva:

```sh
php artisan media:backfill --dry-run
php artisan media:backfill
```

Os arquivos existentes são registrados como públicos e os registros que já existirem preservam sua visibilidade. A coleta de órfãos respeita sete dias por padrão e também pode ser simulada:

```sh
php artisan media:gc --dry-run
php artisan media:gc
```

A coleta procura referências em colunas textuais e JSON do banco antes de remover o objeto do storage e o registro do catálogo. Ela remove no máximo mil registros por execução por padrão; esse limite pode ser ajustado com `--limit`. Durante a rotação, configure `PORTFOLIO_MEDIA_URL_SIGNING_KEY` com a nova chave e mantenha a chave anterior em `PORTFOLIO_MEDIA_URL_PREVIOUS_SIGNING_KEY` até que as URLs antigas expirem.

O PostgreSQL local usa o volume `postgres-data`. Faça `just db-backup` antes de
qualquer migration ou outra operação de risco. O backup de produção é feito
com `just production-db-backup` antes de uma mudança de schema.

## Entrega

A imagem de produção é construída por `.github/workflows/publish-image.yml` a
partir de `docker/app.prod.Dockerfile`. O deploy é controlado pelos manifests
GitOps do repositório de infraestrutura. O runtime usa FrankenPHP e não
executa migrations durante o boot da aplicação.
