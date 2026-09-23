import type { ContentCollectionQuery } from '../api/public-site-source-support';

export function contentCollectionQueryKind(value: string | null): ContentCollectionQuery['kind'] {
  return value === 'post' || value === 'achado' || value === 'colecao' ? value : undefined;
}
