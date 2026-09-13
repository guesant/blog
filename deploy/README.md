# deploy

Estado contínuo via GitOps (ArgoCD) para rodar o blog num cluster k3s homelab. O bootstrap único do cluster (Ansible: k3s, Cilium, CNPG, cert-manager, ArgoCD, Sealed Secrets, hardening de SO) e todos os objetos de controle do Argo (o app em si, o túnel Cloudflare, as políticas de rede do namespace, o `Cluster` do Postgres e a configuração do Image Updater) vivem em [hl-infrastructure](https://github.com/guesant/hl-infrastructure), sob `argocd/apps/satellites/blog` e `argocd/applications/satellites/blog`. Este repositório não declara mais nenhum objeto do Argo; sua única responsabilidade em relação ao deploy é publicar a imagem do container, que o Argo CD Image Updater detecta e aplica sozinho a partir de lá. O histórico de decisões anterior a essa consolidação, em 2026-09-13, está em [docs/pendencias-e-decisoes.md](../docs/pendencias-e-decisoes.md).

## O que fica aqui

Este `deploy/` guarda só ferramentas locais úteis para operar o deploy a partir da máquina do operador: `db-update` aplica uma migração de schema contra o Postgres real via port-forward, `status` resume o estado dos pods e das `Application`s do blog no cluster, e `webhook-register` registra o webhook do GitHub que acelera a sincronização do Argo. Nenhum deles declara infraestrutura; todos assumem que o cluster e as `Application`s já existem, geridos pelo hl-infrastructure.

## Gerar ou trocar um segredo

Os segredos que a aplicação usa (o client secret do Google, as credenciais do túnel Cloudflare, as credenciais do backup do Postgres) são `SealedSecret`, cifrados com a chave pública do cluster e commitados nos values/templates do hl-infrastructure, nunca aqui. Para gerar ou trocar um, use o `just seal` do próprio hl-infrastructure:

```bash
just -f ../hl-infrastructure/justfile fetch-cert
just -f ../hl-infrastructure/justfile seal blog <nome-do-secret> <arquivo-plano>
```

Cole o resultado cifrado no arquivo correspondente dentro de `argocd/apps/satellites/blog/` no hl-infrastructure, e faça commit lá, não aqui.

## Primeiro deploy de uma imagem nova

1. Confirmar que o workflow de publicação de imagem já publicou pelo menos uma imagem para arm64.
2. Bootstrap do cluster e consolidação dos objetos do Argo: seguir o README do hl-infrastructure.
3. Exportar a variável `KUBECONFIG` apontando para o kubeconfig do hl-infrastructure e rodar `just -f deploy/justfile db-update` para aplicar o schema pela primeira vez contra o banco vazio.
4. Confirmar que o site responde pelo hostname do túnel; `just -f deploy/justfile status` para um resumo do estado dos pods e das `Application`s do blog.

Dali em diante, uma imagem nova publicada é detectada e aplicada sozinha pelo Image Updater, sem passo manual neste repositório. Migração de schema continua manual, por decisão: produção nunca migra sozinha.
