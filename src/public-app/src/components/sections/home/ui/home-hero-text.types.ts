import type { ReactNode } from 'react';

export type HomeHeroTextProps = {
  children: ReactNode;
  kind: 'title' | 'location' | 'experience' | 'focus';
};
