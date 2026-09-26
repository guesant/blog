const feedSectionDefinitions = [
  ['recent-writing', 'recentWriting', 'viewWriting', '/writing', 'recent', 'writing', 'grid'],
  ['recent-findings', 'recentFindings', 'viewFindings', '/findings', 'recent', 'finding', 'list'],
  [
    'recent-collections',
    'recentCollections',
    'viewCollections',
    '/collections',
    'recent',
    'collection',
    'grid',
  ],
  ['popular-writing', 'popularWriting', 'viewWriting', '/writing', 'popular', 'writing', 'grid'],
  [
    'popular-findings',
    'popularFindings',
    'viewPopular',
    '/findings?sort=popular',
    'popular',
    'finding',
    'list',
  ],
  [
    'popular-collections',
    'popularCollections',
    'viewCollections',
    '/collections',
    'popular',
    'collection',
    'grid',
  ],
] as const;

export const homeGalleryFeedSectionTemplates = feedSectionDefinitions.map(
  ([id, titleKey, actionKey, href, source, kind, mode]) => ({
    id,
    titleKey,
    actionKey,
    href,
    source,
    kind,
    mode,
  }),
);
