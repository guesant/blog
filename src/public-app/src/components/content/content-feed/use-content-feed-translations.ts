'use client';

import { useTranslations } from '@/i18n/compat';
import { buildContentFeedTranslations } from './build-content-feed-translations';

export function useContentFeedTranslations() {
  const tNav = useTranslations('Nav');

  const tCommon = useTranslations('Common');

  const tPages = useTranslations('Pages.feed');

  return buildContentFeedTranslations({ tNav, tCommon, tPages });
}
