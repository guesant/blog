'use client';

import { Box } from '../../ui';
import { useLocale, useTranslations } from '@/i18n/compat';
import { ConnectionsSection } from '../../content/connections-section';
import type { AchadoDetailContentProps } from './types';
import { AchadoCycleSection } from './achado-cycle-section';
import { AchadoDetailHeader } from './achado-detail-header';
import { AchadoDetailsSection } from './achado-details-section';
import { AchadoLinksSection } from './achado-links-section';
import { AchadoNotesSection } from './achado-notes-section';
import { AchadoTopicsSection } from './achado-topics-section';
import { getAchadoDetailViewData } from './get-achado-detail-view-data';

export function AchadoDetailContent(props: AchadoDetailContentProps) {
  const locale = useLocale();

  const t = useTranslations('Pages.achados');

  const tFields = useTranslations('Pages.achados.fields');

  const tNav = useTranslations('Nav');

  const viewData = getAchadoDetailViewData({
    item: props.item,
    locale,
    t,
    tFields,
    tNav,
  });

  return (
    <Box component="article" visualVariant="achadoDetailContent">
      <AchadoDetailHeader
        item={props.item}
        authors={viewData.authors}
        breadcrumbTrail={viewData.breadcrumbTrail}
        formattedPublishedDate={viewData.formattedPublishedDate}
        t={t}
      />
      <AchadoTopicsSection item={props.item} t={t} />
      <AchadoCycleSection entries={viewData.cycleEntries} t={t} />
      <AchadoNotesSection item={props.item} t={t} />
      <AchadoDetailsSection entries={viewData.details} t={t} />
      <AchadoLinksSection item={props.item} t={t} />
      <ConnectionsSection relations={props.item.relations} />
    </Box>
  );
}
