import { useQuery } from '@tanstack/react-query';
import { normalizeLocale } from '@portfolio/data/api/public-site-source-normalize-locale';
import type { FindingList } from '@portfolio/data/api/public-site-source-support';
import type { ContentFeedProps } from '../../content/content-feed/types';
import { findingsQueryOptions } from '../../../data/queries/findings-query-options';

export type FindingsViewModelProps = {
  locale: string;
  search?: string;
  initialData: FindingList;
};

export function useFindingsViewModel(
  props: FindingsViewModelProps,
): Pick<
  ContentFeedProps,
  'writings' | 'findings' | 'collections' | 'findingsMeta' | 'findingFacets'
> {
  const locale = normalizeLocale(props.locale);

  const data = useQuery({
    ...findingsQueryOptions({ locale, search: props.search }),
    initialData: props.initialData,
  }).data;

  return {
    writings: [],
    findings: data.items,
    collections: [],
    findingsMeta: data.meta,
    findingFacets: data.meta.facets,
  };
}
