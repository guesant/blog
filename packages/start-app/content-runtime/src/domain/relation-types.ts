export type RelationFamily =
  | 'identity'
  | 'dependency'
  | 'learning'
  | 'citation'
  | 'comparison'
  | 'evolution'
  | 'composition'
  | 'hierarchy';

export type RelationTypeId =
  | 'duplicates'
  | 'translation-of'
  | 'adaptation-of'
  | 'edition-of'
  | 'mirror-of'
  | 'fork-of'
  | 'depends-on'
  | 'requires'
  | 'derived-from'
  | 'builds-on'
  | 'extends'
  | 'implements'
  | 'uses'
  | 'inspired-by'
  | 'explains'
  | 'introduces'
  | 'deepens'
  | 'summarizes'
  | 'demonstrates'
  | 'prerequisite-for'
  | 'exercise-for'
  | 'solution-for'
  | 'supports'
  | 'cites'
  | 'references'
  | 'reviews'
  | 'responds-to'
  | 'criticizes'
  | 'corrects'
  | 'relates-to'
  | 'similar-to'
  | 'complements'
  | 'alternative-to'
  | 'compares-with'
  | 'contradicts'
  | 'counterpoint-to'
  | 'competes-with'
  | 'compatible-with'
  | 'incompatible-with'
  | 'supersedes'
  | 'succeeds'
  | 'updates'
  | 'discontinues'
  | 'continues'
  | 'part-of'
  | 'contains'
  | 'chapter-of'
  | 'episode-of'
  | 'lesson-of'
  | 'part-of-series'
  | 'broader-than'
  | 'narrower-than'
  | 'related-topic';

export type RelationLabel = {
  en: string;
  ptBR: string;
};

export type RelationTypeDefinition = {
  id: RelationTypeId;
  family: RelationFamily;
  outboundLabel: RelationLabel;
  inboundLabel: RelationLabel;
  symmetric: boolean;
  description?: RelationLabel;
};

function directional(
  id: RelationTypeId,
  family: RelationFamily,
  outboundLabel: RelationLabel,
  inboundLabel: RelationLabel,
): RelationTypeDefinition {
  return { id, family, outboundLabel, inboundLabel, symmetric: false };
}

function symmetric(
  id: RelationTypeId,
  family: RelationFamily,
  label: RelationLabel,
): RelationTypeDefinition {
  return { id, family, outboundLabel: label, inboundLabel: label, symmetric: true };
}

export const relationTypes: Record<RelationTypeId, RelationTypeDefinition> = {
  duplicates: directional(
    'duplicates',
    'identity',
    { en: 'duplicates', ptBR: 'é duplicata de' },
    { en: 'is duplicated by', ptBR: 'tem como duplicata' },
  ),
  'translation-of': directional(
    'translation-of',
    'identity',
    { en: 'is a translation of', ptBR: 'é tradução de' },
    { en: 'has translation', ptBR: 'tem tradução' },
  ),
  'adaptation-of': directional(
    'adaptation-of',
    'identity',
    { en: 'is an adaptation of', ptBR: 'é adaptação de' },
    { en: 'has adaptation', ptBR: 'tem adaptação' },
  ),
  'edition-of': directional(
    'edition-of',
    'identity',
    { en: 'is an edition of', ptBR: 'é edição de' },
    { en: 'has edition', ptBR: 'tem edição' },
  ),
  'mirror-of': directional(
    'mirror-of',
    'identity',
    { en: 'is a mirror of', ptBR: 'é espelho de' },
    { en: 'has mirror', ptBR: 'tem espelho' },
  ),
  'fork-of': directional(
    'fork-of',
    'identity',
    { en: 'is a fork of', ptBR: 'é fork de' },
    { en: 'has fork', ptBR: 'tem fork' },
  ),

  'depends-on': directional(
    'depends-on',
    'dependency',
    { en: 'depends on', ptBR: 'depende de' },
    { en: 'is a dependency of', ptBR: 'é dependência de' },
  ),
  requires: directional(
    'requires',
    'dependency',
    { en: 'requires', ptBR: 'requer' },
    { en: 'is required by', ptBR: 'é requerido por' },
  ),
  'derived-from': directional(
    'derived-from',
    'dependency',
    { en: 'is derived from', ptBR: 'deriva de' },
    { en: 'gave rise to', ptBR: 'deu origem a' },
  ),
  'builds-on': directional(
    'builds-on',
    'dependency',
    { en: 'builds on', ptBR: 'baseia-se em' },
    { en: 'is a basis for', ptBR: 'é base para' },
  ),
  extends: directional(
    'extends',
    'dependency',
    { en: 'extends', ptBR: 'estende' },
    { en: 'is extended by', ptBR: 'é estendido por' },
  ),
  implements: directional(
    'implements',
    'dependency',
    { en: 'implements', ptBR: 'implementa' },
    { en: 'is implemented by', ptBR: 'é implementado por' },
  ),
  uses: directional(
    'uses',
    'dependency',
    { en: 'uses', ptBR: 'utiliza' },
    { en: 'is used by', ptBR: 'é utilizado por' },
  ),
  'inspired-by': directional(
    'inspired-by',
    'dependency',
    { en: 'is inspired by', ptBR: 'inspira-se em' },
    { en: 'inspired', ptBR: 'inspirou' },
  ),

  explains: directional(
    'explains',
    'learning',
    { en: 'explains', ptBR: 'explica' },
    { en: 'is explained by', ptBR: 'é explicado por' },
  ),
  introduces: directional(
    'introduces',
    'learning',
    { en: 'introduces', ptBR: 'introduz' },
    { en: 'is introduced by', ptBR: 'é introduzido por' },
  ),
  deepens: directional(
    'deepens',
    'learning',
    { en: 'deepens', ptBR: 'aprofunda' },
    { en: 'is deepened by', ptBR: 'é aprofundado por' },
  ),
  summarizes: directional(
    'summarizes',
    'learning',
    { en: 'summarizes', ptBR: 'resume' },
    { en: 'is summarized by', ptBR: 'é resumido por' },
  ),
  demonstrates: directional(
    'demonstrates',
    'learning',
    { en: 'demonstrates', ptBR: 'demonstra' },
    { en: 'is demonstrated by', ptBR: 'é demonstrado por' },
  ),
  'prerequisite-for': directional(
    'prerequisite-for',
    'learning',
    { en: 'is a prerequisite for', ptBR: 'é pré-requisito para' },
    { en: 'has prerequisite', ptBR: 'tem como pré-requisito' },
  ),
  'exercise-for': directional(
    'exercise-for',
    'learning',
    { en: 'is an exercise for', ptBR: 'é exercício de' },
    { en: 'has exercise', ptBR: 'tem exercício' },
  ),
  'solution-for': directional(
    'solution-for',
    'learning',
    { en: 'is a solution for', ptBR: 'é solução para' },
    { en: 'has solution', ptBR: 'tem solução' },
  ),
  supports: directional(
    'supports',
    'learning',
    { en: 'is supporting material for', ptBR: 'é material de apoio para' },
    { en: 'has supporting material', ptBR: 'tem material de apoio' },
  ),

  cites: directional(
    'cites',
    'citation',
    { en: 'cites', ptBR: 'cita' },
    { en: 'is cited by', ptBR: 'é citado por' },
  ),
  references: directional(
    'references',
    'citation',
    { en: 'references', ptBR: 'referencia' },
    { en: 'is referenced by', ptBR: 'é referenciado por' },
  ),
  reviews: directional(
    'reviews',
    'citation',
    { en: 'reviews', ptBR: 'revisa' },
    { en: 'is reviewed by', ptBR: 'é revisado por' },
  ),
  'responds-to': directional(
    'responds-to',
    'citation',
    { en: 'responds to', ptBR: 'responde a' },
    { en: 'has response', ptBR: 'tem resposta' },
  ),
  criticizes: directional(
    'criticizes',
    'citation',
    { en: 'criticizes', ptBR: 'critica' },
    { en: 'is criticized by', ptBR: 'é criticado por' },
  ),
  corrects: directional(
    'corrects',
    'citation',
    { en: 'corrects', ptBR: 'corrige' },
    { en: 'is corrected by', ptBR: 'é corrigido por' },
  ),

  'relates-to': symmetric('relates-to', 'comparison', {
    en: 'relates to',
    ptBR: 'relaciona-se com',
  }),
  'similar-to': symmetric('similar-to', 'comparison', {
    en: 'is similar to',
    ptBR: 'é semelhante a',
  }),
  complements: symmetric('complements', 'comparison', { en: 'complements', ptBR: 'complementa' }),
  'alternative-to': symmetric('alternative-to', 'comparison', {
    en: 'is an alternative to',
    ptBR: 'é alternativa a',
  }),
  'compares-with': symmetric('compares-with', 'comparison', {
    en: 'compares with',
    ptBR: 'compara-se com',
  }),
  contradicts: symmetric('contradicts', 'comparison', { en: 'contradicts', ptBR: 'contradiz' }),
  'counterpoint-to': symmetric('counterpoint-to', 'comparison', {
    en: 'offers a counterpoint to',
    ptBR: 'oferece contraponto a',
  }),
  'competes-with': symmetric('competes-with', 'comparison', {
    en: 'competes with',
    ptBR: 'compete com',
  }),
  'compatible-with': symmetric('compatible-with', 'comparison', {
    en: 'is compatible with',
    ptBR: 'é compatível com',
  }),
  'incompatible-with': symmetric('incompatible-with', 'comparison', {
    en: 'is incompatible with',
    ptBR: 'é incompatível com',
  }),

  supersedes: directional(
    'supersedes',
    'evolution',
    { en: 'supersedes', ptBR: 'substitui' },
    { en: 'was superseded by', ptBR: 'foi substituído por' },
  ),
  succeeds: directional(
    'succeeds',
    'evolution',
    { en: 'succeeds', ptBR: 'sucede' },
    { en: 'was preceded by', ptBR: 'precede' },
  ),
  updates: directional(
    'updates',
    'evolution',
    { en: 'updates', ptBR: 'atualiza' },
    { en: 'was updated by', ptBR: 'é atualizado por' },
  ),
  discontinues: directional(
    'discontinues',
    'evolution',
    { en: 'discontinues', ptBR: 'descontinua' },
    { en: 'was discontinued by', ptBR: 'foi descontinuado por' },
  ),
  continues: directional(
    'continues',
    'evolution',
    { en: 'continues', ptBR: 'continua' },
    { en: 'was continued by', ptBR: 'foi continuado por' },
  ),

  'part-of': directional(
    'part-of',
    'composition',
    { en: 'is part of', ptBR: 'faz parte de' },
    { en: 'contains', ptBR: 'contém' },
  ),
  contains: directional(
    'contains',
    'composition',
    { en: 'contains', ptBR: 'contém' },
    { en: 'is part of', ptBR: 'faz parte de' },
  ),
  'chapter-of': directional(
    'chapter-of',
    'composition',
    { en: 'is a chapter of', ptBR: 'é capítulo de' },
    { en: 'has chapter', ptBR: 'tem como capítulo' },
  ),
  'episode-of': directional(
    'episode-of',
    'composition',
    { en: 'is an episode of', ptBR: 'é episódio de' },
    { en: 'has episode', ptBR: 'tem como episódio' },
  ),
  'lesson-of': directional(
    'lesson-of',
    'composition',
    { en: 'is a lesson of', ptBR: 'é lição de' },
    { en: 'has lesson', ptBR: 'tem como lição' },
  ),
  'part-of-series': directional(
    'part-of-series',
    'composition',
    { en: 'belongs to the series', ptBR: 'pertence à série' },
    { en: 'includes in the series', ptBR: 'inclui na série' },
  ),

  'broader-than': directional(
    'broader-than',
    'hierarchy',
    { en: 'is broader than', ptBR: 'é mais amplo que' },
    { en: 'is narrower than', ptBR: 'é mais específico que' },
  ),
  'narrower-than': directional(
    'narrower-than',
    'hierarchy',
    { en: 'is narrower than', ptBR: 'é mais específico que' },
    { en: 'is broader than', ptBR: 'é mais amplo que' },
  ),
  'related-topic': symmetric('related-topic', 'hierarchy', {
    en: 'relates to',
    ptBR: 'relaciona-se com',
  }),
};

export const relationTypeIds = Object.keys(relationTypes) as RelationTypeId[];

const topicRelationFamilies: RelationFamily[] = [
  'hierarchy',
  'composition',
  'comparison',
  'learning',
];

export const topicRelationTypeIds = relationTypeIds.filter((id) =>
  topicRelationFamilies.includes(relationTypes[id].family),
);

export const referenceRelationTypeIds = relationTypeIds.filter(
  (id) => relationTypes[id].family !== 'hierarchy',
);
