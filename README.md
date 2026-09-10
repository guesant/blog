# Portfolio

Este repositório contém o código-fonte e o conteúdo editorial do portfólio de Gabriel R. Antunes: o site em si, os textos dos estudos de caso e projetos, e a automação que mantém tudo isso publicado e atualizado. Código e conteúdo convivem no mesmo repositório porque o site é gerado a partir desse conteúdo — um estudo de caso novo, um ajuste de currículo ou uma mudança de layout passam pelo mesmo grafo de build, então faz sentido versioná-los juntos em vez de espalhar a fonte de verdade entre um CMS externo e um repositório de código separado.

O site em si é a aplicação Blazor na raiz do repositório: conteúdo editorial, currículo, busca e geração de PDF vivem em um banco SQLite e no próprio app, sem dependência de um CMS externo. O schema desse banco é descrito por migrations do EF Core em `Portfolio.Blazor.Database`, documentadas em [docs/database-schema.md](docs/database-schema.md). O restante do workspace (raiz do monorepo, orquestrado por pnpm/Moon) hospeda só a ferramentação de qualidade compartilhada, como lint, spell-check, verificação de duplicação e checagem de dependências, que continua se aplicando a qualquer código presente no repositório.

A toolchain busca reproduzir versões e comandos, não fingir que todo ambiente precisa executar da mesma forma. No desenvolvimento local, as receitas do `just` encaminham o trabalho para containers com o mesmo SDK fixado por digest que a CI usa, e o Hermit materializa as versões declaradas das ferramentas auxiliares.

A CI roda no GitHub Actions. O workflow `blazor-quality` testa o app a cada push: restaura os pacotes em modo travado, roda os portões de qualidade, compila, executa a suíte de testes e gera o SBOM. O workflow `publish-image` constrói o `Dockerfile` da raiz a cada push em `main` e publica a imagem em `ghcr.io/guesant/portfolio` com as tags `main`, `sha-<commit>` e `latest`. O deploy de produção é por pull: `tools/scripts/deploy.sh` baixa a tag `main` e sobe `docker-compose.prod.yml` atrás de um túnel Cloudflare. Nenhum passo de deploy aplica migrations; mudança de schema é ação deliberada, com backup antes (`just db-update`).

## Security

Siga o processo de divulgação responsável em [SECURITY.md](SECURITY.md).

## License

Código-fonte, ferramentação de build e configuração de CI são licenciados sob MIT. O conteúdo editorial é licenciado separadamente; [REUSE.toml](REUSE.toml) é a fonte de verdade sobre a licença de cada arquivo.
