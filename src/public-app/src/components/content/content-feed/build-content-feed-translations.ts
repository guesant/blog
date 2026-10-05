import type { AchadosTranslator, CommonTranslator, NavTranslator } from '@/i18n/compat-support';
import { translateLabelMap } from './translate-label-map';

type BuildContentFeedTranslationsProps = {
  tCommon: CommonTranslator;
  tNav: NavTranslator;
  tPages: AchadosTranslator;
};

const navLabelKeys = {
  contentLabel: 'content',
  writingLabel: 'writing',
  findingsLabel: 'achados',
  collectionsLabel: 'collections',
  topicLabel: 'topics',
} as const;

const pageLabelKeys = {
  typeLabel: 'typeFilterLabel',
  sortLabel: 'sortBy',
  newestLabel: 'newest',
  oldestLabel: 'oldest',
  alphabeticalLabel: 'alphabetical',
  searchLabel: 'searchPlaceholder',
  applyLabel: 'apply',
  clearLabel: 'clearFilters',
  noResultsLabel: 'noResults',
  resultsLabel: 'results',
  paginationLabel: 'pagination',
  previousLabel: 'previous',
  nextLabel: 'next',
  pageInputLabel: 'pageInput',
  pageOfLabel: 'pageOf',
} as const;

export function buildContentFeedTranslations(props: BuildContentFeedTranslationsProps) {
  return {
    tNav: props.tNav,
    tCommon: props.tCommon,
    tPages: props.tPages,
    ...translateLabelMap(props.tNav, navLabelKeys),
    ...translateLabelMap(props.tPages, pageLabelKeys),
    emptyLabel: props.tCommon('emptyAchados'),
  };
}
