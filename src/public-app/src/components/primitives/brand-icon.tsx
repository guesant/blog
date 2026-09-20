import { Svg, SvgElement } from '../ui';
import { brands } from './brand-icon-data';
import type { BrandName } from './brand-icon-name';

export type { BrandName } from './brand-icon-name';

export { isBrandName } from './is-brand-name';

type BrandIconProps = {
  name: BrandName;
  size?: number;
  useBrandColor?: boolean;
};

export function BrandIcon(props: BrandIconProps) {
  const icon = brands[props.name];

  const size = props.size ?? 20;

  return (
    <Svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={props.useBrandColor ? `#${icon.hex}` : 'currentColor'}
      visualVariant="svgBase"
    >
      <SvgElement component="path" d={icon.path} />
    </Svg>
  );
}
