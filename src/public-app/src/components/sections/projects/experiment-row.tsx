'use client';

import { Box, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { NavLink } from '../../primitives/nav-link';
import type { ExperimentRowProps } from './types';

export function ExperimentRow(props: ExperimentRowProps) {
  const { item: staticItem } = props;

  const t = useTranslations('Common');

  const item = staticItem;

  return (
    <NavLink
      href={`/projects/experiments/${item.slug}`}
      underline="none"
      color="inherit"
      visualVariant="experimentRow"
    >
      <Box>
        <Typography
          className="experiment-title"
          variant="subtitle2"
          component="h3"
          visualVariant="experimentRow"
        >
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" visualVariant="experimentRow2">
          {item.purpose}
        </Typography>
      </Box>
      <Typography color="text.secondary">{t('arrow')}</Typography>
    </NavLink>
  );
}
