import { useSuspenseQuery } from '@tanstack/react-query';
import { normalizeLocale } from '@portfolio/data/api/public-site-source-normalize-locale';
import type { ContentFeedProps } from '../../content/content-feed/types';
import { findingsQueryOptions } from '../../../data/queries';

export type FindingsViewModelProps = {
  locale: string;
  search?: string;
};

export function useFindingsViewModel(
  props: FindingsViewModelProps,
): Pick<
  ContentFeedProps,
  'writings' | 'findings' | 'collections' | 'findingsMeta' | 'findingFacets'
> {
  const locale = normalizeLocale(props.locale);

  const data = useSuspenseQuery(findingsQueryOptions({ locale, search: props.search })).data;

  return {
    writings: [],
    findings: data.items,
    collections: [],
    findingsMeta: data.meta,
    findingFacets: data.meta.facets,
  };
}
