import type { FindingListQuery, RecordValue } from './public-site-source-support';
import { fallbackValue } from './public-site-source-fallback';
import { numberValue } from './public-site-source-number-value';

type FindingListMetaNumbers = {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
};

export function findingListMetaNumbers(
  value: RecordValue | undefined,
  filters: FindingListQuery,
): FindingListMetaNumbers {
  const perPage = Number(
    fallbackValue(numberValue(value?.per_page), fallbackValue(filters.perPage, 20)),
  );

  const total = Number(fallbackValue(numberValue(value?.total), 0));

  const page = Number(fallbackValue(numberValue(value?.page), fallbackValue(filters.page, 1)));

  const lastPage = Number(
    fallbackValue(numberValue(value?.last_page), Math.max(1, Math.ceil(total / perPage))),
  );

  return { page, perPage, total, lastPage };
}
