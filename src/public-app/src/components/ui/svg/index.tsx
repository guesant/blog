import type { ComponentProps } from 'react';
import { svgVariants } from './variants';

type SvgProps = ComponentProps<'svg'> & { visualVariant?: string };

export function Svg(props: SvgProps) {
  const { visualVariant, ...svgProps } = props;

  const style = svgVariants[visualVariant ?? 'svgBase'];

  return <svg {...svgProps} style={style} />;
}
