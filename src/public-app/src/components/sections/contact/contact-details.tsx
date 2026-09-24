import { ActionSection } from '../../content/action-section';
import { ContactActionEmail } from '../../contact/contact-action-email';
import { ContactActionProfiles } from '../../contact/contact-action-profiles';
import { Box } from '../../ui';
import type { ContactDetailsProps } from './types';

export function ContactDetails(props: ContactDetailsProps) {
  const { site, hasEmail, t, tExternalProfiles } = props;

  return (
    <Box data-testid="contact-actions">
      <ActionSection>
        <ContactActionEmail site={site} hasEmail={hasEmail} label={t('email')} />
        <ContactActionProfiles
          profiles={site.contact.profiles}
          tExternalProfiles={tExternalProfiles}
        />
      </ActionSection>
    </Box>
  );
}
