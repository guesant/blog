import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { CreditsPageContent as CreditsContent, PackageCredit } from '@portfolio/content/types';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { PageHeader } from '../content/page-header';
import { ExternalLink } from '../primitives/external-link';

type CreditsSectionProps = { heading: string; maxWidth?: string; children: ReactNode };

function CreditsSection(props: CreditsSectionProps) {
  const { heading, maxWidth = '60ch', children } = props;
  return (
    <Box component="section" sx={{ mt: { xs: 4, md: 5 }, maxWidth }}>
      <Typography component="h2" variant="h5" sx={{ mb: 1.5 }}>
        {heading}
      </Typography>
      {children}
    </Box>
  );
}

type EntryListProps = { entries: CreditsContent['credits']['entries'] };

function EntryList(props: EntryListProps) {
  const { entries } = props;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        columnGap: 3,
        rowGap: 1.5,
      }}
    >
      {entries.map((entry) => (
        <Box key={entry.url || entry.name}>
          {entry.url ? (
            <ExternalLink href={entry.url} sx={{ fontWeight: 700 }}>
              {entry.name}
            </ExternalLink>
          ) : (
            <Typography sx={{ fontWeight: 700 }}>{entry.name}</Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {entry.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

type PackageListProps = { packages: PackageCredit[] };

function PackageList(props: PackageListProps) {
  const { packages } = props;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        columnGap: 3,
        rowGap: 2,
      }}
    >
      {packages.map((pkg) => (
        <Box key={pkg.name}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
            <Link
              href={`https://www.npmjs.com/package/${pkg.name}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontWeight: 700 }}
            >
              {pkg.name}
            </Link>
            <Typography component="span" variant="body2" color="text.disabled">
              {pkg.version}
            </Typography>
          </Box>
          {pkg.description && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mt: 0.25 }}>
              {pkg.description}
            </Typography>
          )}
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ mt: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}
          >
            {pkg.license && <span>{pkg.license}</span>}
            {pkg.author && <span>© {pkg.author}</span>}
            {pkg.repositoryUrl && (
              <Link href={pkg.repositoryUrl} target="_blank" rel="noopener noreferrer">
                repo
              </Link>
            )}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

type CreditsPageContentProps = { content: CreditsContent };

export async function CreditsPageContent(props: CreditsPageContentProps) {
  const { content } = props;
  const t = await getTranslations('Pages.credits');
  const tFooter = await getTranslations('Footer');
  const acknowledgements = content.credits.entries.filter(
    (entry) => entry.category === 'reference' && !entry.url,
  );
  const references = content.credits.entries.filter(
    (entry) => entry.category === 'reference' && entry.url,
  );
  const infrastructure = content.credits.entries.filter(
    (entry) => entry.category === 'infrastructure',
  );

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={content.page.title}
        description={content.page.description}
        breadcrumbs={[{ label: tFooter('credits') }]}
      />
      {acknowledgements.length > 0 && (
        <CreditsSection heading={t('eyebrow')} maxWidth="none">
          <EntryList entries={acknowledgements} />
        </CreditsSection>
      )}
      {references.length > 0 && (
        <CreditsSection heading={t('referencesHeading')}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {references.map((entry) => (
              <Box key={entry.url}>
                <ExternalLink href={entry.url} sx={{ fontWeight: 700 }}>
                  {entry.name}
                </ExternalLink>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {entry.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </CreditsSection>
      )}
      {infrastructure.length > 0 && (
        <CreditsSection heading={t('infrastructureHeading')} maxWidth="none">
          <EntryList entries={infrastructure} />
        </CreditsSection>
      )}
      <CreditsSection heading={t('librariesHeading')} maxWidth="none">
        <PackageList packages={content.libraries} />
      </CreditsSection>
      <CreditsSection heading={t('toolsHeading')} maxWidth="none">
        <PackageList packages={content.tools} />
      </CreditsSection>
    </>
  );
}
