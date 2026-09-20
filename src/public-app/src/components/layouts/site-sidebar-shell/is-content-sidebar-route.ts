export function isContentSidebarRoute(route: string): boolean {
  return ['writing', 'findings', 'topics', 'collections', 'technologies'].includes(route);
}
