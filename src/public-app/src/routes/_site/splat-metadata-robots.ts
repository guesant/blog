import type { RouteMetadata } from './splat-support';

export function metadataRobots(
  metadata: Pick<RouteMetadata, 'robots' | 'noIndex'>,
): string | undefined {
  const directives = (metadata.robots ?? '')
    .split(',')
    .map((directive) => directive.trim())
    .filter(Boolean);

  if (metadata.noIndex) {
    directives.splice(
      0,
      directives.length,
      ...directives.filter((directive) => !['index', 'noindex'].includes(directive.toLowerCase())),
      'noindex',
    );
  }

  return directives.length > 0 ? [...new Set(directives)].join(', ') : 'index, follow';
}
