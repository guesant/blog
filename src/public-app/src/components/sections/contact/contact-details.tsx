'use client';

import { Box, Typography } from '../../ui';
import { ContactDetailsActions } from './contact-details-actions';
import { Stack } from '../../ui';
import { contactLabel, type ContactDetailsProps } from './types';

export function ContactDetails(props: ContactDetailsProps) {
  const { page, site, hasEmail, t, tCommon, tExternalProfiles } = props;

  return (
    <Box visualVariant="contactDetails">
      <Typography variant="overline" color="text.secondary">
        {contactLabel({ page, site, hasEmail, tCommon })}
      </Typography>
      <Stack data-testid="contact-actions" visualVariant="contactDetails">
        <ContactDetailsActions
          hasEmail={hasEmail}
          site={site}
          t={t}
          tExternalProfiles={tExternalProfiles}
        />
      </Stack>
    </Box>
  );
}
