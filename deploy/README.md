# deploy

Estado contínuo via GitOps (ArgoCD) para rodar o blog num cluster k3s homelab. O bootstrap único do cluster (Ansible: k3s, Cilium, CNPG, cert-manager, ArgoCD, Sealed Secrets, hardening de SO) e a raiz do app-of-apps do Argo migraram para [hl-infrastructure](https://github.com/guesant/hl-infrastructure) em 2026-09-12; o histórico de decisões anterior a essa data está em [docs/pendencias-e-decisoes.md](../docs/pendencias-e-decisoes.md).

## GitOps

A pasta [gitops](https://github.com/guesant/blog/tree/main/deploy/gitops) é o que o ArgoCD sincroniza continuamente a partir deste repositório. A subpasta applications guarda só os objetos de controle, um por componente. O hl-infrastructure sincroniza essa subpasta inteira via uma aplicação satélite com recursão de diretório ligada, então um commit aqui não exige nenhum passo manual no outro repositório. Cada componente aponta para uma pasta dentro de apps e cria o namespace do blog no destino sozinho.

As pastas de blog e de cloudflared, dentro de apps, são charts Helm guarda-chuva que consomem o chart genérico `stakater/application` (vendorizado, para o Argo não depender da rede do cluster a cada sync) para gerar o Deployment, o Service e o ConfigMap de cada um a partir de um values.yaml próprio. A pasta de postgres é um chart mínimo, sem essa dependência, com a definição do cluster CloudNativePG, o backup via plugin Barman Cloud, e as políticas de rede e de recurso do namespace.

A connection string do Postgres nunca é escrita neste repositório, nem cifrada: o Deployment da aplicação monta o secret que o próprio CloudNativePG gera como arquivos, e monta a variável de conexão em tempo de execução, dentro do pod.

### Segredos que faltam gerar

O values.yaml do blog já tem o client secret do Google cifrado como um sealed secret (o chart genérico sabe renderizar esse tipo de recurso nativamente). Faltam dois: o do túnel do cloudflared e o das credenciais do backup do Postgres, ambos gerados com `kubeseal` a partir do hl-infrastructure, que tem o certificado público do controlador e o kubeconfig do cluster:

```bash
just -f ../hl-infrastructure/justfile fetch-cert
just -f ../hl-infrastructure/justfile seal blog cloudflared-secret <arquivo-plano-com-o-credentials.json>
just -f ../hl-infrastructure/justfile seal blog postgres-backup-credentials <arquivo-plano-com-as-chaves-s3>
```

Cole o resultado cifrado no values.yaml do cloudflared ou no template do sealed secret de backup do postgres, conforme o caso, e faça commit. Só o recurso cifrado entra no git; o secret de verdade nunca toca o repositório.

### Webhook do GitHub para o ArgoCD

O values.yaml do cloudflared já roteia a rota do webhook para o servidor do Argo, e o Ansible do hl-infrastructure já grava o segredo compartilhado no secret interno do Argo. Falta só registrar o webhook do lado do GitHub, com `just -f deploy/justfile webhook-register <url>`; isso só funciona depois que o túnel Cloudflare existir e a URL pública for conhecida. Até lá, o ArgoCD continua sincronizando por polling normal a cada três minutos, sem regressão.

## Passo a passo completo do primeiro deploy

1. Confirmar que o workflow de publicação de imagem já publicou pelo menos uma imagem para arm64.
2. Bootstrap do cluster: seguir o README do hl-infrastructure.
3. Gerar os sealed secrets que faltam (ver acima) e colar nos respectivos arquivos.
4. Criar o túnel no painel da Cloudflare (login interativo, não dá para automatizar); preencher o id do túnel e o hostname reais no values.yaml do cloudflared.
5. Preencher o caminho de destino e o endpoint do backup com um bucket S3-compatível real.
6. Commitar tudo neste repositório.
7. Exportar a variável `KUBECONFIG` apontando para o kubeconfig do hl-infrastructure e rodar `just -f deploy/justfile db-update` para aplicar o schema pela primeira vez contra o banco vazio.
8. Confirmar que o site responde pelo hostname do túnel; `just -f deploy/justfile status` para um resumo do estado dos pods do blog.

Dali em diante, um push que mude algo na pasta de gitops é sincronizado sozinho pelo ArgoCD, através da aplicação satélite no hl-infrastructure, e uma imagem nova publicada é detectada e aplicada sozinha pelo Image Updater. Migração de schema continua manual, por decisão: produção nunca migra sozinha.
