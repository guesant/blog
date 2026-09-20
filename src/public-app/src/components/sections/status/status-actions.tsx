'use client';

import { Button, Stack } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ExternalLink } from '../../primitives/external-link';
import { NavButton } from '../../primitives/nav-button';

type StatusActionsProps = {
  kind: 'notFound' | 'error';
  sourceRepositoryUrl?: string;
  reset?: () => void;
};

export function StatusActions(props: StatusActionsProps) {
  const t = useTranslations(`Pages.${props.kind}`);

  const isError = props.kind === 'error';

  const issueReportUrl = props.sourceRepositoryUrl
    ? `${props.sourceRepositoryUrl.replace(/\/$/, '')}/issues/new`
    : undefined;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} visualVariant="statusActions">
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
          <ExternalLink
            href={issueReportUrl ?? ''}
            color="text.secondary"
            visualVariant="statusActions"
            children={t('issue')}
          />
        }
      />
    </Stack>
  );
}
