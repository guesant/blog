import { brands } from './brand-icon-data';
import { brandColors } from './brand-icon-colors';
import type { BrandName } from './brand-icon-name';

export { isBrandName } from './is-brand-name';

type BrandIconProps = {
  name: BrandName;
  size?: number;
  useBrandColor?: boolean;
};

export function BrandIcon(props: BrandIconProps) {
  const BrandComponent = brands[props.name];

  const size = props.size ?? 20;

  return (
    <BrandComponent
      aria-hidden="true"
      focusable="false"
      title=""
      size={size}
      color={props.useBrandColor ? `#${brandColors[props.name]}` : 'currentColor'}
    />
  );
}
