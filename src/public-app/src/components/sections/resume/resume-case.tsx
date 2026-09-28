'use client';

import {
  ResumeCaseAction,
  ResumeCaseFrame,
  ResumeCaseLink,
  ResumeCaseMeta,
  ResumeCaseRole,
  ResumeCaseSummary,
  ResumeEntryBlockFrame,
} from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { Link as LocaleLink } from '../../../i18n/navigation';
import type { ResumeCaseProps } from './types';

export function ResumeCase(props: ResumeCaseProps) {
  const { staticItem } = props;

  const t = useTranslations('Pages.resume');

  const item = staticItem;

  return (
    <ResumeEntryBlockFrame>
      <ResumeCaseFrame>
        <ResumeCaseLink component={LocaleLink} href={item.url ?? `/cases/${item.slug}`}>
          {item.title}
        </ResumeCaseLink>
        <ResumeCaseMeta>{item.meta}</ResumeCaseMeta>
      </ResumeCaseFrame>
      <ResumeCaseSummary>{item.summary}</ResumeCaseSummary>
      <ResumeCaseRole>{item.role}</ResumeCaseRole>
      <ResumeCaseAction component={LocaleLink} href={item.url ?? `/cases/${item.slug}`}>
        {t('caseLink')}
      </ResumeCaseAction>
    </ResumeEntryBlockFrame>
  );
}
