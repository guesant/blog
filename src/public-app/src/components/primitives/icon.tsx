import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { IconGlyph } from '../ui';
import { icons } from './icon-data';
import type { IconName } from './icon-name';

export type { IconName } from './icon-name';

type IconProps = {
  name: IconName;
  size?: number;
  visualVariant?: string;
} & Omit<LucideProps, 'size' | 'strokeWidth'>;

export function Icon(props: IconProps) {
  const { name, size = 20, visualVariant, ...lucideProps } = props;

  const LucideIcon: ComponentType<LucideProps> = icons[name];

  return (
    <IconGlyph
      {...lucideProps}
      icon={LucideIcon}
      name={name}
      size={size}
      strokeWidth={1.8}
      visualVariant={visualVariant}
    />
  );
}
