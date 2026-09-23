import type { RouteData } from './content-data-route-data';
import type { RouteLoader } from './content-data-route-loader';
import { statusData } from './content-data-status-data';

type SlugDetailKind = Extract<
  RouteData['kind'],
  | 'case-detail'
  | 'collection-detail'
  | 'finding-detail'
  | 'project-detail'
  | 'experiment-detail'
  | 'snippet-detail'
  | 'technology-detail'
  | 'writing-detail'
>;

type CreateSlugDetailLoaderOptions<Kind extends SlugDetailKind, Item> = {
  kind: Kind;
  load: (slug: string, locale: string) => Promise<Item | undefined>;
  build: (item: Item) => Extract<RouteData, { kind: Kind }>;
};

export function createSlugDetailLoader<Kind extends SlugDetailKind, Item>(
  options: CreateSlugDetailLoaderOptions<Kind, Item>,
): RouteLoader {
  return async ({ locale, slug }) => {
    if (!slug) {
      return statusData(locale, 'notFound');
    }

    const item = await options.load(slug, locale);

    return item ? options.build(item) : statusData(locale, 'notFound');
  };
}
