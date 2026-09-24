'use client';

import { Typography } from '../ui';
import type { Profile, SiteText } from '@portfolio/data/domain/types';
import { MaintenanceFrame } from './maintenance-frame';

type MaintenancePageProps = { site: SiteText; profile: Profile };

export function MaintenancePage(props: MaintenancePageProps) {
  const { site: staticSite, profile: staticProfile } = props;

  const site = staticSite;

  const profile = staticProfile;

  return (
    <MaintenanceFrame>
      <Typography component="h1" variant="h1" visualVariant="maintenanceTitle">
        {site.maintenance.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" visualVariant="maintenanceDescription">
        {site.maintenance.description}
      </Typography>
      <Typography variant="body2" color="text.secondary" visualVariant="maintenanceSignature">
        {profile.name}
      </Typography>
    </MaintenanceFrame>
  );
}
