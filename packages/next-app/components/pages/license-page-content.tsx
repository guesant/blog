import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ProtectedEmailChallenge } from '@portfolio/content/protected-email';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { ProtectedEmail } from '../contact/protected-email';
import { PageHeader } from '../content/page-header';

type LicenseSectionProps = { heading: string; children: ReactNode };

function LicenseSection(props: LicenseSectionProps) {
  const { heading, children } = props;
  return (
    <Box component="section" sx={{ mt: { xs: 4, md: 5 }, maxWidth: '60ch' }}>
      <Typography component="h2" variant="h5" sx={{ mb: 1.5 }}>
        {heading}
      </Typography>
      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {children}
      </Typography>
    </Box>
  );
}

type LicensePageContentProps = { emailChallenge?: ProtectedEmailChallenge };

export async function LicensePageContent(props: LicensePageContentProps) {
  const { emailChallenge } = props;
  const t = await getTranslations('Pages.license');
  const tFooter = await getTranslations('Footer');
  const tCommon = await getTranslations('Common');

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={[{ label: tFooter('license') }]}
      />
      <LicenseSection heading={t('codeHeading')}>{t('codeBody')}</LicenseSection>
      <LicenseSection heading={t('contentHeading')}>{t('contentBody')}</LicenseSection>
      <LicenseSection heading={t('aiHeading')}>{t('aiBody')}</LicenseSection>
      {emailChallenge && (
        <Box
          sx={{
            mt: { xs: 4, md: 5 },
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography color="text.secondary">{t('contact')}</Typography>
          <ProtectedEmail challenge={emailChallenge} label={tCommon('reveal')} showAddress />
        </Box>
      )}
    </>
  );
}
