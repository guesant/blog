# Política para simulações e conteúdos educacionais externos

Esta política vale para PhET e qualquer outro conteúdo que não tenha sido
criado integralmente neste repositório.

## Regra padrão

O site deve preferir engines e simulações próprias, locais e auditáveis. Não
serão carregados scripts de terceiros em runtime, nem conteúdo de CDN, para
fazer uma ferramenta funcionar. Um link externo pode ser oferecido como
referência educacional, desde que a licença e a disponibilidade sejam
registradas.

## Fluxo de aprovação

Antes de reutilizar um conteúdo:

1. identificar a obra exata, versão, autor, URL oficial e data da consulta;
2. ler a licença do arquivo específico e os termos do produto — a licença de
   uma simulação não deve ser presumida para código-fonte, imagens, áudio,
   traduções, presets, marca ou uma versão comercial;
3. classificar a integração como `local`, `link externo` ou `incorporado`;
4. registrar permissões, restrições, atribuição obrigatória e obrigação de
   disponibilizar modificações;
5. fazer revisão técnica, de acessibilidade, privacidade e segurança antes da
   publicação.

Sem esse registro, o conteúdo fica bloqueado para publicação.

## Critérios de decisão

- **Reimplementar localmente:** usar quando a matemática/física é conhecida,
  a implementação pode ser testada e nenhum asset protegido precisa ser
  copiado. A implementação deve citar referências científicas, não copiar
  código ou identidade visual.
- **Link externo:** usar quando a experiência original é importante ou quando
  a licença de redistribuição não está clara. O link deve abrir explicitamente
  em outra origem e não deve mascarar a autoria.
- **Incorporar:** somente quando a licença permitir essa forma de uso, o
  conteúdo puder ser fixado/auditado e a atribuição puder permanecer visível.
  Iframes e integrações externas ficam fora do caminho crítico do site.

## Registro mínimo de crédito

Cada item aprovado precisa manter: nome da obra, autores/projeto, instituição,
versão, licença, URL oficial, data da consulta, tipo de integração, texto de
atribuição, alterações feitas e responsável pela revisão.

## PhET

O projeto não assume uma licença única para toda a coleção PhET. A página
oficial de licenciamento diferencia arquivos HTML, código-fonte e produtos ou
presets específicos; portanto, a equipe deve conferir o termo vigente da obra
exata antes de copiar, redistribuir, modificar ou incorporar qualquer arquivo.

Referências oficiais para a revisão:

- [PhET — informações de licenciamento](https://phet.colorado.edu/en/licensing);
- [PhET — licenciamento de simulações HTML](https://phet.colorado.edu/en/licensing/html);
- [PhET — código-fonte](https://phet.colorado.edu/en/about/source-code).

Esta documentação é um procedimento interno de engenharia e não substitui uma
análise jurídica quando o site tiver uso comercial, publicidade, conteúdo
incorporado ou redistribuição de arquivos de terceiros.
