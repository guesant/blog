import type {
  ContentCollectionMeta,
  ContentLocale,
  RecordValue,
} from './public-site-source-support';
import { findingFacets } from './public-site-source-finding-facets';
import { publicCollectionMetaNumbers } from './public-site-source-public-collection-meta-numbers';

type PublicCollectionMetaProps = {
  value: RecordValue | undefined;
  query: import('./public-site-source-support').ContentCollectionQuery;
  locale: ContentLocale;
};

export function publicCollectionMeta(props: PublicCollectionMetaProps): ContentCollectionMeta {
  const numbers = publicCollectionMetaNumbers({ meta: props.value, query: props.query });

  return {
    ...numbers,
    locale: props.locale,
    facets: props.value?.facets ? findingFacets(props.value.facets) : undefined,
  };
}
