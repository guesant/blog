import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { iconGlyphVariants } from './variants';

type IconGlyphProps = {
  icon: ComponentType<LucideProps>;
  name: string;
  size: number;
  strokeWidth: number;
  visualVariant?: string;
} & Omit<LucideProps, 'size' | 'strokeWidth'>;

export function IconGlyph(props: IconGlyphProps) {
  const { icon: LucideIcon, name, size, strokeWidth, visualVariant, ...lucideProps } = props;

  const style = iconGlyphVariants[visualVariant ?? 'base'];

  return (
    <LucideIcon
      {...lucideProps}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden
      data-site-icon={name}
      style={style}
    />
  );
}
