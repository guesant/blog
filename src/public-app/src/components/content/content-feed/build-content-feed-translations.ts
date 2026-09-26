import type { AchadosTranslator, CommonTranslator, NavTranslator } from '@/i18n/compat-support';

type BuildContentFeedTranslationsProps = {
  tNav: NavTranslator;
  tCommon: CommonTranslator;
  tPages: AchadosTranslator;
};

export function buildContentFeedTranslations(props: BuildContentFeedTranslationsProps) {
  return {
    tNav: props.tNav,
    tCommon: props.tCommon,
    tPages: props.tPages,
    contentLabel: props.tNav('content'),
    writingLabel: props.tNav('writing'),
    findingsLabel: props.tNav('achados'),
    collectionsLabel: props.tNav('collections'),
    topicLabel: props.tNav('topics'),
    typeLabel: props.tPages('typeFilterLabel'),
    sortLabel: props.tPages('sortBy'),
    newestLabel: props.tPages('newest'),
    oldestLabel: props.tPages('oldest'),
    alphabeticalLabel: props.tPages('alphabetical'),
    popularLabel: props.tPages('mostPopular'),
    searchLabel: props.tPages('searchPlaceholder'),
    applyLabel: props.tPages('apply'),
    clearLabel: props.tPages('clearFilters'),
    noResultsLabel: props.tPages('noResults'),
    emptyLabel: props.tCommon('emptyAchados'),
    resultsLabel: props.tPages('results'),
    paginationLabel: props.tPages('pagination'),
    firstLabel: props.tPages('first'),
    previousLabel: props.tPages('previous'),
    nextLabel: props.tPages('next'),
    lastLabel: props.tPages('last'),
    modeLabel: props.tPages('displayMode'),
    paginationModeLabel: props.tPages('paginationMode'),
    infiniteModeLabel: props.tPages('infiniteMode'),
    perPageLabel: props.tPages('perPage'),
  };
}
