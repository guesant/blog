import type { TechnologyBadge } from '../domain/types.ts';
import { getSnapshot } from './public-site-source-get-snapshot';
import { stringValue } from './public-site-source-string-value';

export async function listTechnologies(
  slugs?: string[],
  locale?: string,
): Promise<TechnologyBadge[]> {
  const technologies = (await getSnapshot(locale)).technologies;

  const filtered = slugs?.length
    ? technologies.filter((technology) => slugs.includes(stringValue(technology.slug)))
    : technologies;

  return filtered.map((technology) => ({
    slug: stringValue(technology.slug),
    name: stringValue(technology.name),
  }));
}
