const detailRoutes: Record<string, string> = {
  colecoes: '/collection-detail',
  collections: '/collection-detail',
  snippets: '/snippet-detail',
  topics: '/topic-detail',
  technologies: '/technology-detail',
  writing: '/writing-detail',
};

export function detailRoutePath(segment: string | undefined): string {
  return detailRoutes[segment ?? ''] ?? `/${segment}`;
}
