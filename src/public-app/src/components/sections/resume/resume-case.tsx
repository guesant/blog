'use client';

import { Box, Link, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { Link as LocaleLink } from '../../../i18n/navigation';
import type { ResumeCaseProps } from './types';

export function ResumeCase(props: ResumeCaseProps) {
  const { staticItem } = props;

  const t = useTranslations('Pages.resume');

  const item = staticItem;

  return (
    <Box>
      <Box visualVariant="resumeCase">
        <Link
          component={LocaleLink}
          href={item.url ?? `/cases/${item.slug}`}
          visualVariant="resumeCaseLink"
        >
          {item.title}
        </Link>
        <Typography variant="body2" color="text.secondary">
          {item.meta}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" visualVariant="resumeCase">
        {item.summary}
      </Typography>
      <Typography variant="body2" visualVariant="resumeCase2">
        {item.role}
      </Typography>
      <Link
        component={LocaleLink}
        href={item.url ?? `/cases/${item.slug}`}
        visualVariant="resumeCaseAction"
      >
        {t('caseLink')}
      </Link>
    </Box>
  );
}
