'use client';

import { Box, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import type { ExperimentRowProps } from './types';
import { ExperimentRow2Text } from '../../ui/semantic/ExperimentRow2Text';
import { ExperimentRowLink } from '../../ui/semantic/ExperimentRowLink';
import { ExperimentRowText } from '../../ui/semantic/ExperimentRowText';

export function ExperimentRow(props: ExperimentRowProps) {
  const { item: staticItem } = props;

  const t = useTranslations('Common');

  const item = staticItem;

  return (
    <ExperimentRowLink
      href={item.url ?? `/projects/experiments/${item.slug}`}
      underline="none"
      color="inherit"
    >
      <Box>
        <ExperimentRowText className="experiment-title" variant="subtitle2" component="h3">
          {item.name}
        </ExperimentRowText>
        <ExperimentRow2Text variant="body2" color="text.secondary">
          {item.purpose}
        </ExperimentRow2Text>
      </Box>
      <Typography color="text.secondary">{t('arrow')}</Typography>
    </ExperimentRowLink>
  );
}
