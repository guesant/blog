'use client';

import { Box } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { Icon } from '../../primitives/icon';
import { StatusActions } from './status-actions';
import type { StatusPageKind } from './status-page-kind';

type StatusContentProps = {
  kind: StatusPageKind;
  sourceRepositoryUrl?: string;
  reset?: () => void;
};

export function StatusContent(props: StatusContentProps) {
  const t = useTranslations(`Pages.${props.kind}`);

  return (
    <Box visualVariant="statusContent">
      <Icon name="problem" size={22} visualVariant="status" />
      <PageHeader title={t('title')} description={t('description')} />
      <StatusActions {...props} />
    </Box>
  );
}
