import { Stack } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ProfileIcon } from '../../primitives/profile-icon';
import { Icon } from '../../primitives/icon';
import { SidebarAction } from './sidebar-action';
import { externalProfileLabel } from '@portfolio/data/config/external-profiles';
import type { SiteText } from '@portfolio/data/domain/types';

type RightSidebarContactProfilesProps = {
  site: SiteText;
};

export function RightSidebarContactProfiles(props: RightSidebarContactProfilesProps) {
  const tExternalProfiles = useTranslations('ExternalProfiles');

  return (
    <Stack visualVariant="sidebarContactProfiles">
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
    </Stack>
  );
}
