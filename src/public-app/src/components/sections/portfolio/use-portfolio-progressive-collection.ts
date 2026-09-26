import type {
  ContentCollectionMeta,
  ContentCollection,
} from '@portfolio/data/api/public-site-source-support';
import { collectionQuery } from '../../../data/queries/content-data-collection-query';
import { useProgressiveCollection } from '../../../data/queries/use-progressive-collection';

type UsePortfolioProgressiveCollectionProps<T> = {
  collection: Exclude<ContentCollection, 'references'>;
  getKey: (item: T) => string;
  items: T[];
  pagination: ContentCollectionMeta;
  queryKey: string;
  search: string;
};

export function usePortfolioProgressiveCollection<T>(
  props: UsePortfolioProgressiveCollectionProps<T>,
) {
  return useProgressiveCollection<T>({
    collection: props.collection,
    query: collectionQuery(props.search, 'portfolio_page', 3),
    initialPage: { items: props.items, meta: props.pagination },
    queryKey: ['portfolio', props.queryKey, props.search],
    getKey: props.getKey,
  });
}
