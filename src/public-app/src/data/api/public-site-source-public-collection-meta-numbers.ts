import type { ContentCollectionQuery, RecordValue } from './public-site-source-support';
import { fallbackValue } from './public-site-source-fallback';
import { numberValue } from './public-site-source-number-value';
import { PUBLIC_CONTENT_PAGE_SIZE } from '../public-content-page-size';

type PublicCollectionMetaNumbers = {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
};

type PublicCollectionMetaNumbersProps = {
  meta: RecordValue | undefined;
  query: ContentCollectionQuery;
};

export function publicCollectionMetaNumbers(
  props: PublicCollectionMetaNumbersProps,
): PublicCollectionMetaNumbers {
  const page = Number(
    fallbackValue(numberValue(props.meta?.page), fallbackValue(props.query.page, 1)),
  );

  const perPage = Number(
    fallbackValue(
      numberValue(props.meta?.per_page),
      fallbackValue(props.query.perPage, PUBLIC_CONTENT_PAGE_SIZE),
    ),
  );

  const total = Number(fallbackValue(numberValue(props.meta?.total), 0));

  const lastPage = Number(fallbackValue(numberValue(props.meta?.last_page), 1));

  return { page, perPage, total, lastPage };
}
