'use client';

import { Box, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import type { ExperimentRowProps } from './types';
import { ExperimentPurposeText } from '../../ui/semantic/ExperimentPurposeText';
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
        <ExperimentPurposeText variant="body2" color="text.secondary">
          {item.purpose}
        </ExperimentPurposeText>
      </Box>
      <Typography color="text.secondary">{t('arrow')}</Typography>
    </ExperimentRowLink>
  );
}
