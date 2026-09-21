import type { TechnologyBadge } from '../domain/types.ts';
import { getContentCollection } from './public-site-source-get-content-collection-items';
import { stringValue } from './public-site-source-string-value';

export async function listTechnologies(
  slugs?: string[],
  locale?: string,
): Promise<TechnologyBadge[]> {
  const technologies = await getContentCollection<Record<string, unknown>>('technologies', locale, {
    perPage: 100,
  });

  const filtered = slugs?.length
    ? technologies.filter((technology) => slugs.includes(stringValue(technology.slug)))
    : technologies;

  return filtered.map((technology) => ({
    slug: stringValue(technology.slug),
    name: stringValue(technology.name),
  }));
}
