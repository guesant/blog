'use client';

import { Box, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { groupByLabel, type ConnectionsSectionProps } from './types';
import { ConnectionGroup } from './connection-group';

export function ConnectionsSection(props: ConnectionsSectionProps) {
  const { relations } = props;

  const t = useTranslations('Pages.achados');

  if (relations.length === 0) {
    return null;
  }

  return (
    <Box component="section" visualVariant="connectionsSection">
      <Typography component="h2" visualVariant="connectionsSection">
        {t('connectionsHeading')}
      </Typography>
      <Box visualVariant="connectionsSection2">
        {[...groupByLabel(relations)].map(([label, items]) => (
          <ConnectionGroup key={label} label={label} items={items} />
        ))}
      </Box>
    </Box>
  );
}
