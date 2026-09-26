const portfolioSectionDefinitions = [
  ['cases', 'portfolioCases', 'viewCases', '/cases'],
  ['projects', 'portfolioProjects', 'viewProjects', '/projects'],
  ['experiments', 'portfolioExperiments', 'viewExperiments', '/projects'],
  ['collections', 'portfolioCollections', 'viewCollections', '/collections'],
  ['snippets', 'portfolioSnippets', 'viewSnippets', '/snippets'],
  ['technologies', 'portfolioTechnologies', 'viewTechnologies', '/technologies'],
  ['topics', 'portfolioTopics', 'viewTopics', '/topics'],
  ['credits', 'portfolioCredits', 'viewCredits', '/credits'],
] as const;

export const homePortfolioSectionTemplates = portfolioSectionDefinitions.map(
  ([key, titleKey, actionKey, href]) => ({
    id: `portfolio-${key}`,
    titleKey,
    actionKey,
    href,
    key,
  }),
);
