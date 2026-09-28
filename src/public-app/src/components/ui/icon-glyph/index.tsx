import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

type IconGlyphProps = {
  icon: ComponentType<LucideProps>;
  name: string;
  size: number;
  strokeWidth: number;
} & Omit<LucideProps, 'size' | 'strokeWidth'>;

export function IconGlyph(props: IconGlyphProps) {
  const { icon: LucideIcon, name, size, strokeWidth, ...lucideProps } = props;

  return (
    <LucideIcon
      {...lucideProps}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden
      data-site-icon={name}
    />
  );
}
