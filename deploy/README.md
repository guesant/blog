# deploy

Estado contínuo via GitOps (ArgoCD) para rodar o blog num cluster k3s homelab. O bootstrap único do cluster (Ansible: k3s, Cilium, CNPG, cert-manager, ArgoCD, Sealed Secrets, hardening de SO) e a raiz do app-of-apps do Argo migraram para [`guesant/hl-infrastructure`](https://github.com/guesant/hl-infrastructure) em 2026-09-12; o histórico de decisões anterior a essa data está em [docs/pendencias-e-decisoes.md](../docs/pendencias-e-decisoes.md).

## GitOps (`gitops/`)

O que o ArgoCD sincroniza continuamente a partir deste repositório. `applications/` guarda só os objetos de controle (um `Application` por componente, mais o `image-updater.yaml`); o `hl-infrastructure` sincroniza esse diretório inteiro via uma `Application` satélite (`blog-satellite`, com `directory.recurse: true`), então um commit aqui não exige nenhum passo manual no outro repositório. Cada `Application` aponta para um subdiretório de `apps/` e cria o namespace `blog` no destino sozinha (`syncOptions: CreateNamespace=true`). `apps/blog` e `apps/cloudflared` são charts Helm guarda-chuva que consomem `stakater/application` (vendorizado em `charts/*.tgz`, para o Argo não depender da rede do cluster a cada sync) para gerar Deployment, Service e ConfigMap a partir de `values.yaml`; `apps/postgres` é um chart mínimo, sem essa dependência, com a CRD `Cluster` do CloudNativePG, o backup via plugin Barman Cloud e as `NetworkPolicy`/`ResourceQuota`/`LimitRange` do namespace.

A connection string do Postgres nunca é escrita neste repositório, nem cifrada: o Deployment da app monta o Secret que o próprio CloudNativePG gera (`postgres-app`) como arquivos, e monta a `PORTFOLIO_DB_CONNECTION` em tempo de execução, dentro do pod.

### Segredos que faltam gerar

`apps/blog/values.yaml` já tem o `sealedSecret` com `PORTFOLIO_ADMIN_GOOGLE_CLIENT_SECRET` cifrado (o chart `stakater/application` sabe renderizar `SealedSecret` nativamente a partir de `application.sealedSecret.files`). Faltam dois: o do túnel do cloudflared e o das credenciais do backup do Postgres, ambos gerados com `kubeseal` a partir do `hl-infrastructure` (que tem o certificado público do controlador e o `kubeconfig` do cluster):

```bash
just -f ../hl-infrastructure/justfile fetch-cert
just -f ../hl-infrastructure/justfile seal blog cloudflared-secret <arquivo-plano-com-o-credentials.json>
just -f ../hl-infrastructure/justfile seal blog postgres-backup-credentials <arquivo-plano-com-as-chaves-s3>
```

Cole o `encryptedData` resultante em `apps/cloudflared/values.yaml` (formato `application.sealedSecret.files`, igual ao `apps/blog`) ou em `apps/postgres/templates/backup-credentials-sealedsecret.yaml`, conforme o caso, e faça commit. Só o `SealedSecret` cifrado entra no git; o `Secret` de verdade nunca toca o repositório.

### Webhook do GitHub para o ArgoCD

`apps/cloudflared/values.yaml` já roteia `/api/webhook` para `argocd-server`, e o Ansible do `hl-infrastructure` já grava o segredo compartilhado em `argocd-secret` (chave `webhook.github.secret`). Falta só registrar o webhook do lado do GitHub, com `just -f deploy/justfile webhook-register <url>`; isso só funciona depois que o túnel Cloudflare existir e a URL pública for conhecida. Até lá, o ArgoCD continua sincronizando por polling normal a cada 3 minutos, sem regressão.

## Passo a passo completo do primeiro deploy

1. Confirmar que `.github/workflows/publish-image.yml` já publicou pelo menos uma imagem (tag `sha-<commit>` `linux/arm64`).
2. Bootstrap do cluster: seguir o `README.md` do `hl-infrastructure` (Ansible + `argocd/root`).
3. Gerar os `SealedSecret` que faltam (ver acima) e colar nos respectivos `values.yaml`/templates.
4. Criar o túnel no painel da Cloudflare (login interativo, não dá para automatizar); preencher o `tunnel`/`hostname` reais em `apps/cloudflared/values.yaml`.
5. Preencher `destinationPath`/`endpointURL` em `apps/postgres/templates/backup-objectstore.yaml` com um bucket S3-compatível real.
6. Commitar tudo neste repositório.
7. `export KUBECONFIG=<caminho-do-hl-infrastructure>/ansible/kubeconfig` e `just -f deploy/justfile db-update` para aplicar o schema pela primeira vez contra o banco vazio.
8. Confirmar que o site responde pelo hostname do túnel; `just -f deploy/justfile status` para um resumo do estado dos pods do blog.

Dali em diante, um `git push` que mude algo em `deploy/gitops` é sincronizado sozinho pelo ArgoCD (via a `Application` satélite no `hl-infrastructure`), e uma imagem nova publicada com tag `sha-<40 hex>` é detectada e aplicada sozinha pelo Image Updater. Migração de schema continua manual, por decisão: produção nunca migra sozinha.
