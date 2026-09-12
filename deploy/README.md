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

O que o ArgoCD sincroniza continuamente a partir deste repositório. Namespace `blog`, Kustomize plano (sem Helm, sem overlays). `argocd/application.yaml` e `argocd/image-updater.yaml` não entram na lista de recursos do `kustomization.yaml`: são objetos de controle, aplicados uma única vez pelo Ansible, não parte do estado da aplicação.

A connection string do Postgres nunca é escrita neste repositório, nem cifrada: o Deployment da app monta o Secret que o próprio CloudNativePG gera (`postgres-app`) como arquivos, e monta a `PORTFOLIO_DB_CONNECTION` em tempo de execução, dentro do pod.

### Segredos que faltam gerar

Os dois `sealed-secret.yaml` (um em `app/`, com `PORTFOLIO_ADMIN_GOOGLE_CLIENT_SECRET`; outro em `cloudflared/`, com o `credentials.json` do túnel) não existem ainda neste repositório, porque `kubeseal` só consegue cifrar contra o certificado público do controlador, que só existe depois que o cluster já está de pé. Depois do primeiro `bootstrap`:

```bash
just -f deploy/justfile fetch-cert
just -f deploy/justfile seal blog app-secret <arquivo-plano-com-o-client-secret>
just -f deploy/justfile seal blog cloudflared-secret <arquivo-plano-com-o-credentials.json>
```

Cada comando gera um `SealedSecret` pronto para colar no diretório correspondente; depois de colado, adicione o arquivo à lista de `resources` do `kustomization.yaml` e faça commit. Só o `SealedSecret` cifrado entra no git; o `Secret` de verdade nunca toca o repositório.

## Passo a passo completo do primeiro deploy

1. Confirmar que `.github/workflows/publish-image.yml` já publicou pelo menos uma imagem multi-arquitetura (tag `sha-<commit>` cobrindo `linux/arm64`).
2. Preencher `ansible/inventory.ini` e `ansible/group_vars/all.yml`.
3. `just -f deploy/justfile bootstrap`.
4. Gerar os dois `sealed-secret.yaml` (ver acima) e adicioná-los ao `kustomization.yaml`.
5. Criar o túnel no painel da Cloudflare (login interativo, não dá para automatizar); preencher o `tunnel`/`hostname` reais em `gitops/cloudflared/configmap.yaml`.
6. Commitar tudo.
7. `just -f deploy/justfile db-update` para aplicar o schema pela primeira vez contra o banco vazio.
8. Confirmar que o site responde pelo hostname do túnel; `just -f deploy/justfile status` para um resumo do estado dos pods e da Application.

Dali em diante, um `git push` que mude algo em `deploy/gitops` é sincronizado sozinho pelo ArgoCD, e uma imagem nova publicada com tag `sha-<40 hex>` é detectada e aplicada sozinha pelo Image Updater. Migração de schema continua manual, por decisão: produção nunca migra sozinha.

## Pendência

Backup do Postgres em produção. O CNPG já traz o mecanismo (`Cluster.spec.backup`, `ScheduledBackup`), mas só faz sentido apontado para um destino fora do próprio Pi (um bucket S3-compatível); configurar isso fica para quando houver um lugar concreto para gravar.
