import { SidebarContactProfilesFrame } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ProfileIcon } from '../../primitives/profile-icon';
import { Icon } from '../../primitives/icon';
import { SidebarAction } from './sidebar-action';
import { externalProfileLabel } from '@portfolio/data/config/external-profiles';
import type { ReactNode } from 'react';
import type { SiteText } from '@portfolio/data/domain/types';

type RightSidebarContactActionsProps = {
  site: SiteText;
  email?: ReactNode;
};

export function RightSidebarContactActions(props: RightSidebarContactActionsProps) {
  const tExternalProfiles = useTranslations('ExternalProfiles');

  return (
    <SidebarContactProfilesFrame>
      {props.email}
      {props.site.contact.profiles.map((item) => (
        <SidebarAction
          key={item.url}
          component="a"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          icon={<ProfileIcon platform={item.platform} size={14} />}
          label={externalProfileLabel(item, tExternalProfiles)}
          endIcon={<Icon name="external" size={12} />}
        />
      ))}
    </SidebarContactProfilesFrame>
  );
}
