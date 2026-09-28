'use client';

import type { Profile, SiteText } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { MaintenanceFrame } from './maintenance-frame';
import { MaintenanceDescriptionText } from '../ui/semantic/MaintenanceDescriptionText';
import { MaintenanceSignatureText } from '../ui/semantic/MaintenanceSignatureText';
import { MaintenanceTitleText } from '../ui/semantic/MaintenanceTitleText';

type MaintenancePageProps = { site: SiteText; profile: Profile };

export function MaintenancePage(props: MaintenancePageProps) {
  const t = useTranslations('Pages.maintenance');

  return (
    <MaintenanceFrame>
      <MaintenanceTitleText component="h1" variant="h1">
        {props.site.maintenance.title || t('title')}
      </MaintenanceTitleText>
      <MaintenanceDescriptionText variant="body1" color="text.secondary">
        {props.site.maintenance.description || t('description')}
      </MaintenanceDescriptionText>
      <MaintenanceSignatureText variant="body2" color="text.secondary">
        {props.profile.name}
      </MaintenanceSignatureText>
    </MaintenanceFrame>
  );
}
