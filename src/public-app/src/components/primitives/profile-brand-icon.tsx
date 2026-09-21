import { Svg, SvgElement } from '../ui';
import { profileBrands, type ProfileBrandName } from './profile-brand-icon-data';

type ProfileBrandIconProps = {
  name: ProfileBrandName;
  size?: number;
};

export type { ProfileBrandName } from './profile-brand-icon-data';

export function ProfileBrandIcon(props: ProfileBrandIconProps) {
  const icon = profileBrands[props.name];

  const size = props.size ?? 20;

  return (
    <Svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      visualVariant="svgBase"
    >
      <SvgElement component="path" d={icon.path} />
    </Svg>
  );
}
