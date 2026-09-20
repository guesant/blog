const detailRoutes: Record<string, string> = {
  cases: '/case-detail',
  colecoes: '/collection-detail',
  collections: '/collection-detail',
  findings: '/finding-detail',
  projects: '/project-detail',
  snippets: '/snippet-detail',
  topics: '/topic-detail',
  technologies: '/technology-detail',
  tools: '/tool',
  writing: '/writing-detail',
};

export function detailRoutePath(segment: string | undefined): string {
  return detailRoutes[segment ?? ''] ?? `/${segment}`;
}
