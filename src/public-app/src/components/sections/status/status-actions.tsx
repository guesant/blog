'use client';

import { Button } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ConditionalContent } from '../../primitives/conditional-content';
import { NavButton } from '../../primitives/nav-button';
import type { StatusPageKind } from './status-page-kind';
import type { StatusTranslator } from '@/i18n/compat-support';
import { StatusActionsLink } from '../../ui/semantic/StatusActionsLink';
import { StatusActionsStack } from '../../ui/semantic/StatusActionsStack';

type StatusActionsProps = {
  kind: StatusPageKind;
  sourceRepositoryUrl?: string;
  reset?: () => void;
};

export function StatusActions(props: StatusActionsProps) {
  const t: StatusTranslator = useTranslations(`Pages.${props.kind}`);

  const isError = props.kind !== 'notFound';

  const issueReportUrl = props.sourceRepositoryUrl
    ? `${props.sourceRepositoryUrl.replace(/\/$/, '')}/issues/new`
    : undefined;

  return (
    <StatusActionsStack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <ConditionalContent
        condition={Boolean(isError && props.reset)}
        content={<Button variant="contained" onClick={props.reset} children={t('retry')} />}
      />
      <NavButton variant={isError ? 'outlined' : 'contained'} href="/">
        {t('home')}
      </NavButton>
      <ConditionalContent
        condition={Boolean(issueReportUrl)}
        content={
          <StatusActionsLink
            href={issueReportUrl ?? ''}
            color="text.secondary"

            children={t('issue')}
          />
        }
      />
    </StatusActionsStack>
  );
}
