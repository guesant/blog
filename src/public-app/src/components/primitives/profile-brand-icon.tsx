import { profileBrands, type ProfileBrandName } from './profile-brand-icon-data';

type ProfileBrandIconProps = {
  name: ProfileBrandName;
  size?: number;
};

export type { ProfileBrandName } from './profile-brand-icon-data';

export function ProfileBrandIcon(props: ProfileBrandIconProps) {
  const BrandComponent = profileBrands[props.name];

  const size = props.size ?? 20;

  return (
    <BrandComponent
      aria-hidden="true"
      focusable="false"
      title=""
      size={size}
      color="currentColor"
    />
  );
}
