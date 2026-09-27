'use client';

import { Typography } from '../ui';
import type { Profile, SiteText } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { MaintenanceFrame } from './maintenance-frame';

type MaintenancePageProps = { site: SiteText; profile: Profile };

export function MaintenancePage(props: MaintenancePageProps) {
  const t = useTranslations('Pages.maintenance');

  return (
    <MaintenanceFrame>
      <Typography component="h1" variant="h1" visualVariant="maintenanceTitle">
        {props.site.maintenance.title || t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" visualVariant="maintenanceDescription">
        {props.site.maintenance.description || t('description')}
      </Typography>
      <Typography variant="body2" color="text.secondary" visualVariant="maintenanceSignature">
        {props.profile.name}
      </Typography>
    </MaintenanceFrame>
  );
}
