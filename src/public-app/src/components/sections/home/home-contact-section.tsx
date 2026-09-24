'use client';

import { Typography } from '../../ui';
import { ActionSection } from '../../content/action-section';
import { ContactActionEmail } from '../../contact/contact-action-email';
import { ContactActionProfiles } from '../../contact/contact-action-profiles';
import type { HomeContactSectionProps } from './types';

export function HomeContactSection(props: HomeContactSectionProps) {
  const { page, site, showContact, hasEmail, t, tExternalProfiles } = props;

  if (!showContact) {
    return null;
  }

  return (
    <ActionSection
      id="contact"
      title={page.contactTitle}
      divider
      description={<Typography component="span">{page.contactDescription}</Typography>}
    >
      <ContactActionEmail site={site} hasEmail={hasEmail} label={t('contactEmailButton')} />
      <ContactActionProfiles
        profiles={site.contact.profiles}
        tExternalProfiles={tExternalProfiles}
      />
    </ActionSection>
  );
}
