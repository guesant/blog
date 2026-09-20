import type { Technology } from '../domain/types.ts';
import { slugFromKey } from './public-site-source-slug-from-key';
import { getTechnologies } from './public-site-source-get-technologies';

export async function getTechnologyBySlug(
  slug: string,
  locale?: string,
): Promise<Technology | undefined> {
  return (await getTechnologies(locale)).find(
    (technology) => technology.slug === slug || slugFromKey(technology.slug) === slug,
  );
}
