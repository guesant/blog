'use client';

import { useLocale, useTranslations } from '@/i18n/compat';
import { ConnectionsSection } from '../../content/connections-section';
import type { FindingDetailPageProps } from './types';
import { FindingReviewCycleSection } from './finding-review-cycle-section';
import { FindingDetailHeader } from './finding-detail-header';
import { FindingFactsSection } from './finding-facts-section';
import { FindingReferenceLinksSection } from './finding-reference-links-section';
import { FindingNotesSection } from './finding-notes-section';
import { FindingTopicsSection } from './finding-topics-section';
import { getFindingDetailViewData } from './get-finding-detail-view-data';
import { FindingDetailPageFrame } from '../../ui/semantic/FindingDetailPageFrame';

export function FindingDetailPage(props: FindingDetailPageProps) {
  const locale = useLocale();

  const t = useTranslations('Pages.achados');

  const tFields = useTranslations('Pages.achados.fields');

  const tNav = useTranslations('Nav');

  const viewData = getFindingDetailViewData({
    item: props.item,
    locale,
    t,
    tFields,
    tNav,
  });

  return (
    <FindingDetailPageFrame component="article">
      <FindingDetailHeader
        item={props.item}
        authors={viewData.authors}
        breadcrumbTrail={viewData.breadcrumbTrail}
        formattedPublishedDate={viewData.formattedPublishedDate}
        t={t}
      />
      <FindingTopicsSection item={props.item} t={t} />
      <FindingReviewCycleSection entries={viewData.cycleEntries} t={t} />
      <FindingNotesSection item={props.item} t={t} />
      <FindingFactsSection entries={viewData.details} t={t} />
      <FindingReferenceLinksSection item={props.item} t={t} />
      <ConnectionsSection relations={props.item.relations} />
    </FindingDetailPageFrame>
  );
}
