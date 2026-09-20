'use client';

import { Typography } from '../../ui';
import { ExplorationSection, ExplorationTileGrid } from '../../content/exploration-section';
import type { HomeContactSectionProps } from './types';
import { HomeContactEmail } from './home-contact-email';
import { HomeContactProfiles } from './home-contact-profiles';

export function HomeContactSection(props: HomeContactSectionProps) {
  const { page, site, showContact, hasEmail, t, tExternalProfiles } = props;

  if (!showContact) {
    return null;
  }

  return (
    <ExplorationSection
      id="contact"
      title={page.contactTitle}
      divider
      description={<Typography component="span">{page.contactDescription}</Typography>}
    >
      <ExplorationTileGrid>
        <HomeContactEmail site={site} hasEmail={hasEmail} label={t('contactEmailButton')} />
        <HomeContactProfiles site={site} tExternalProfiles={tExternalProfiles} />
      </ExplorationTileGrid>
    </ExplorationSection>
  );
}
