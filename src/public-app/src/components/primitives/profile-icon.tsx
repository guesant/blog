import type { ExternalProfile } from '@portfolio/data/domain/types';
import { Icon, type IconName } from './icon';
import { ProfileBrandIcon, type ProfileBrandName } from './profile-brand-icon';

type ProfilePlatform = ExternalProfile['platform'];

const platformBrands: Partial<Record<ProfilePlatform, ProfileBrandName>> = {
  bluesky: 'bluesky',
  github: 'github',
  gitlab: 'gitlab',
  instagram: 'instagram',
  mastodon: 'mastodon',
  orcid: 'orcid',
  researchgate: 'researchgate',
  scholar: 'googlescholar',
};

const platformGlyphs: Partial<Record<ProfilePlatform, IconName>> = {
  lattes: 'graduation-cap',
  linkedin: 'briefcase',
};

type ProfileIconProps = {
  platform: ProfilePlatform;
  size?: number;
};

export function ProfileIcon(props: ProfileIconProps) {
  const { platform, size = 16 } = props;

  const brand = platformBrands[platform];

  if (brand) {
    return <ProfileBrandIcon name={brand} size={size} />;
  }

  return <Icon name={platformGlyphs[platform] ?? 'external'} size={size} />;
}
