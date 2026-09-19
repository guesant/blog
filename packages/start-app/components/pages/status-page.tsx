'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTranslations } from '@/i18n/compat';
import { issueReportUrl } from '../../content/project';
import { PageHeader } from '../content/page-header';
import { ExternalLink } from '../primitives/external-link';
import { Icon } from '../primitives/icon';
import { NavButton } from '../primitives/nav-button';

type StatusPageProps = { kind: 'notFound' | 'error'; reset?: () => void };

export function StatusPage(props: StatusPageProps) {
  const { kind, reset } = props;
  const t = useTranslations(`Pages.${kind}`);
  const isError = kind === 'error';

  return (
    <Box sx={{ minHeight: { xs: '55vh', md: '60vh' }, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <Icon name="problem" size={22} style={{ opacity: 0.45, marginBottom: '0.75rem' }} />
        <PageHeader eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: 'flex-start' }}
        >
          {isError && reset ? (
            <Button variant="contained" onClick={reset}>
              {t('retry')}
            </Button>
          ) : null}
          <NavButton variant={isError ? 'outlined' : 'contained'} href="/">
            {t('home')}
          </NavButton>
          <ExternalLink href={issueReportUrl} color="text.secondary" sx={{ py: 1 }}>
            {t('issue')}
          </ExternalLink>
        </Stack>
      </Box>
    </Box>
  );
}
