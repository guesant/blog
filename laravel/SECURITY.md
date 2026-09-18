# Segurança e supply chain

## Regras do projeto

- PHP, Node, npm, Composer, build e testes são executados somente dentro de containers Docker.
- O frontend não carrega código executável de CDN ou de terceiros em tempo de execução.
- Dependências devem ser alteradas somente com lockfile revisado; novas dependências exigem justificativa e auditoria.
- Instalações JavaScript usam `npm ci` e, quando compatível, `--ignore-scripts`.
- Imagens de runtime são referenciadas por digest, nunca por `latest` sem digest.
- A imagem de produção roda como `www-data`, com `no-new-privileges`, filesystem raiz somente leitura e capacidades Linux removidas.
- Dados de entrada das ferramentas permanecem no navegador; uploads e telemetria não são requisitos do produto.
- O entrypoint de produção falha fechado se o SQLite persistente estiver ausente
  ou vazio; ele não cria um banco silenciosamente. O bootstrap inicial exige
  `DATABASE_ALLOW_EMPTY_BOOTSTRAP=true` de forma explícita e temporária.
- Antes de executar migrations em um banco existente, o entrypoint cria um
  snapshot consistente com `VACUUM INTO` em `storage/app/backups`.

## Artefatos fixados

| Artefato | Referência | Verificação |
| --- | --- | --- |
| PHP/Composer | `laravelsail/php83-composer@sha256:428fa9b2edf2cfc1be71a6c32f0d6723449e5edc6ae1c3eeaac5a31d89b0c9f2` | digest do manifesto multi-arquitetura |
| Node desenvolvimento | `node:22@sha256:8a34c4ab3ea2c5cd194f07e317b2a8f09461d3c8b05c4e34c8ccd56d56024c4d` | digest do manifesto multi-arquitetura |
| Node assets produção | `node:22-bookworm-slim@sha256:83f487e0a63425e5b4d146fb5e5be574bcbe1b7b843d3ebafdd95eaf7767a7e5` | digest do manifesto multi-arquitetura |
| Cloudflared | `cloudflare/cloudflared@sha256:0aa26e284f05e6c77ae375b8c9c11d9eb6a448fb7bcd8d40f31cb6176189eb38` | digest do manifesto multi-arquitetura |
| Tectonic x86_64 | versão 0.17.0 | SHA-256 `8533d07f9ccbd7a65824b9e0459041bca34af1eb33daba48f59215593753a3b7` |
| Tectonic aarch64 | versão 0.17.0 | SHA-256 `b10954a95404f3ab2328d2fa59a5ebab8e657f893fab096f98be8db7c0c979b8` |

## Revisões restantes

- Revisar o acesso ao socket Docker do webhook; ele permanece uma superfície de
  risco equivalente a acesso privilegiado ao host. A redução futura deve
  preferir um proxy de socket com allowlist ou um runner de deploy separado.
- Avaliar restrições de egress da rede do webhook e executar a aplicação de
  desenvolvimento como usuário não-root quando o bind mount deixar de exigir
  permissões do host.
- Configurar o segredo de bootstrap somente durante a primeira implantação e
  removê-lo imediatamente depois; a ausência do arquivo em implantações
  seguintes deve interromper o deploy para permitir restauração de backup.

O workflow `.github/workflows/quality.yml` gera o SBOM SPDX dos lockfiles e
executa auditorias npm/Composer dentro dos containers. O artefato gerado em
`sbom/` é intencionalmente ignorado no Git para ser tratado como artefato de
cada execução, sempre derivado dos lockfiles versionados.
