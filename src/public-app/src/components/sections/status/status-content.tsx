'use client';

import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { StatusActions } from './status-actions';
import type { StatusTranslator } from '@/i18n/compat-support';
import type { StatusPageKind } from './status-page-kind';
import { StatusMessageBodyFrame } from '../../ui/semantic/StatusMessageBodyFrame';
import { StatusIcon } from '../../ui/semantic/StatusIcon';

type StatusContentProps = {
  kind: StatusPageKind;
  sourceRepositoryUrl?: string;
  reset?: () => void;
};

export function StatusContent(props: StatusContentProps) {
  const t: StatusTranslator = useTranslations(`Pages.${props.kind}`);

  return (
    <StatusMessageBodyFrame>
      <StatusIcon name="problem" size={22} />
      <PageHeader title={t('title')} description={t('description')} variant="showcase" />
      <StatusActions {...props} />
    </StatusMessageBodyFrame>
  );
}
