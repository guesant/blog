'use client';

import { useTranslations } from '@/i18n/compat';

export function useContentFeedTranslations() {
  const tNav = useTranslations('Nav');

  const tCommon = useTranslations('Common');

  const tPages = useTranslations('Pages.achados');

  return {
    tNav,
    tCommon,
    tPages,
    contentLabel: tNav('content'),
    writingLabel: tNav('writing'),
    findingsLabel: tNav('achados'),
    collectionsLabel: tNav('collections'),
    topicLabel: tNav('topics'),
    typeLabel: tPages('typeFilterLabel'),
    sortLabel: tPages('sortBy'),
    newestLabel: tPages('newest'),
    oldestLabel: tPages('oldest'),
    alphabeticalLabel: tPages('alphabetical'),
    popularLabel: tPages('mostPopular'),
    searchLabel: tPages('searchPlaceholder'),
    applyLabel: tPages('apply'),
    clearLabel: tPages('clearFilters'),
    noResultsLabel: tPages('noResults'),
    emptyLabel: tCommon('emptyAchados'),
    resultsLabel: tPages('results'),
    paginationLabel: tPages('pagination'),
    firstLabel: tPages('first'),
    previousLabel: tPages('previous'),
    nextLabel: tPages('next'),
    lastLabel: tPages('last'),
  };
}
