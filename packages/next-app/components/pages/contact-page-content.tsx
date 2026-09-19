'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { PageIntroduction, SiteText } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { ContactProfileGrid } from '../contact/contact-profile-grid';
import { ProtectedEmail } from '../contact/protected-email';
import { EmptyState } from '../content/empty-state';
import { PageHeader } from '../content/page-header';
import { LayoutStack as Stack } from '../primitives/layout-stack';

type ContactSource = Record<string, unknown>;
type ContactDetailsProps = {
  page: PageIntroduction;
  site: SiteText;
  contactSource: ContactSource;
  hasEmail: boolean;
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
  tExternalProfiles: ReturnType<typeof useTranslations>;
};
type ContactLabelProps = Pick<ContactDetailsProps, 'page' | 'site' | 'hasEmail' | 'tCommon'>;

function contactLabel(props: ContactLabelProps) {
  const { page, site, tCommon } = props;
  if (!site.contact.available) {
    return tCommon('unavailable');
  }
  return page.eyebrow;
}

function ContactDetails(props: ContactDetailsProps) {
  const { page, site, contactSource, hasEmail, t, tCommon, tExternalProfiles } = props;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
        gap: { xs: 4, md: 8 },
        alignItems: 'center',
        py: { xs: 6, md: 8 },
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="overline"
        color="text.secondary"
        {...getEditableProps(contactSource, 'available')}
      >
        {contactLabel({ page, site, hasEmail, tCommon })}
      </Typography>
      <Stack data-testid="contact-actions" sx={{ minWidth: 0, gap: 2 }}>
        {hasEmail && (
          <Box>
            <ProtectedEmail
              challenge={site.contact.emailChallenge}
              label={t('email')}
              variant="button"
            />
          </Box>
        )}
        {site.contact.profiles.length > 0 && (
          <Box {...getEditableProps(contactSource, 'profiles')}>
            <ContactProfileGrid
              profiles={site.contact.profiles}
              tExternalProfiles={tExternalProfiles}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
}

type ContactPageContentProps = { page: PageIntroduction; site: SiteText };

export function ContactPageContent(props: ContactPageContentProps) {
  const { page: staticPage, site: staticSite } = props;
  const t = useTranslations('Pages.contact');
  const tCommon = useTranslations('Common');
  const tExternalProfiles = useTranslations('ExternalProfiles');
  const tNav = useTranslations('Nav');
  const { content: page, source } = useEditableContent(staticPage);
  const { content: site, raw: siteSource } = useEditableContent(staticSite);
  const contactSource = siteSource.contact as Record<string, unknown>;
  const hasEmail = site.contact.hasEmail;
  const hasProfiles = site.contact.profiles.length > 0;
  const hasContact = hasEmail || hasProfiles;
  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={site.contact.available ? page.description : undefined}
        breadcrumbs={[{ label: tNav('contact') }]}
        editableProps={{
          eyebrow: getEditableProps(source, 'eyebrow'),
          title: getEditableProps(source, 'title'),
          description: getEditableProps(source, 'description'),
        }}
      />
      {!hasContact ? (
        <EmptyState icon="problem">{tCommon('emptyContact')}</EmptyState>
      ) : (
        <ContactDetails
          page={page}
          site={site}
          contactSource={contactSource}
          hasEmail={hasEmail}
          t={t}
          tCommon={tCommon}
          tExternalProfiles={tExternalProfiles}
        />
      )}
    </>
  );
}
