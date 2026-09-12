# deploy

Bootstrap único via Ansible e estado contínuo via GitOps (ArgoCD) para rodar o blog num Raspberry Pi com k3s. Contexto completo e as decisões tomadas estão em [docs/pendencias-e-decisoes.md](../docs/pendencias-e-decisoes.md).

## Ansible (`ansible/`)

Provisiona o Pi do zero: cgroups, k3s (sem Traefik/ServiceLB, sem o CNI padrão), Cilium, o operador CloudNativePG, ArgoCD, o controlador de Sealed Secrets e o Argo CD Image Updater. Roda uma única vez por host.

Antes da primeira execução, copie os dois arquivos de exemplo e preencha com os dados reais (nenhum dos dois entra no git):

```bash
cp ansible/inventory.example.ini ansible/inventory.ini
cp ansible/group_vars/all.example.yml ansible/group_vars/all.yml
```

Depois:

```bash
just -f deploy/justfile bootstrap
```

## GitOps (`gitops/`)

O que o ArgoCD sincroniza continuamente a partir deste repositório, na convenção app-of-apps. `applications/` guarda só os objetos de controle (um `Application` por componente, mais o `image-updater.yaml`), aplicados uma única vez pelo Ansible; cada `Application` aponta para um subdiretório de `apps/` e cria o namespace `blog` no destino sozinha (`syncOptions: CreateNamespace=true`). `apps/blog` e `apps/cloudflared` são charts Helm guarda-chuva que consomem `stakater/application` (vendorizado em `charts/*.tgz`, para o Argo não depender da rede do Pi a cada sync) para gerar Deployment, Service e ConfigMap a partir de `values.yaml`; `apps/postgres` é um chart mínimo, sem dependência, só com a CRD `Cluster` do CloudNativePG.

A connection string do Postgres nunca é escrita neste repositório, nem cifrada: o Deployment da app monta o Secret que o próprio CloudNativePG gera (`postgres-app`) como arquivos, e monta a `PORTFOLIO_DB_CONNECTION` em tempo de execução, dentro do pod.

### Segredos que faltam gerar

`apps/blog/values.yaml` já tem o `sealedSecret` com `PORTFOLIO_ADMIN_GOOGLE_CLIENT_SECRET` cifrado (o chart `stakater/application` sabe renderizar `SealedSecret` nativamente a partir de `application.sealedSecret.files`). Falta o do túnel do cloudflared, que só pode ser gerado depois que o cluster já está de pé, já que `kubeseal` cifra contra o certificado público do controlador rodando nele:

```bash
just -f deploy/justfile fetch-cert
just -f deploy/justfile seal blog cloudflared-secret <arquivo-plano-com-o-credentials.json>
```

O comando gera um `SealedSecret` pronto; cole o `encryptedData` resultante em `apps/cloudflared/values.yaml`, no mesmo formato `application.sealedSecret.files` usado em `apps/blog`, e faça commit. Só o `SealedSecret` cifrado entra no git; o `Secret` de verdade nunca toca o repositório.

### Webhook do GitHub para o ArgoCD

`apps/cloudflared/values.yaml` já roteia `/api/webhook` para `argocd-server`, e o Ansible já grava o segredo compartilhado em `argocd-secret` (chave `webhook.github.secret`). Falta só registrar o webhook do lado do GitHub, com `just -f deploy/justfile webhook-register <url>`; isso só funciona depois que o túnel Cloudflare existir e a URL pública for conhecida (ver pendência acima). Até lá, o ArgoCD continua sincronizando por polling normal a cada 3 minutos, sem regressão.

## Passo a passo completo do primeiro deploy

1. Confirmar que `.github/workflows/publish-image.yml` já publicou pelo menos uma imagem multi-arquitetura (tag `sha-<commit>` cobrindo `linux/arm64`).
2. Preencher `ansible/inventory.ini` e `ansible/group_vars/all.yml`.
3. `just -f deploy/justfile bootstrap`.
4. Gerar o `SealedSecret` do túnel do cloudflared (ver acima) e colar em `apps/cloudflared/values.yaml`.
5. Criar o túnel no painel da Cloudflare (login interativo, não dá para automatizar); preencher o `tunnel`/`hostname` reais em `apps/cloudflared/values.yaml`.
6. Commitar tudo.
7. `just -f deploy/justfile db-update` para aplicar o schema pela primeira vez contra o banco vazio.
8. Confirmar que o site responde pelo hostname do túnel; `just -f deploy/justfile status` para um resumo do estado dos pods e da Application.

Dali em diante, um `git push` que mude algo em `deploy/gitops` é sincronizado sozinho pelo ArgoCD, e uma imagem nova publicada com tag `sha-<40 hex>` é detectada e aplicada sozinha pelo Image Updater. Migração de schema continua manual, por decisão: produção nunca migra sozinha.

## Pendência

Backup do Postgres em produção. O CNPG já traz o mecanismo (`Cluster.spec.backup`, `ScheduledBackup`), mas só faz sentido apontado para um destino fora do próprio Pi (um bucket S3-compatível); configurar isso fica para quando houver um lugar concreto para gravar.
