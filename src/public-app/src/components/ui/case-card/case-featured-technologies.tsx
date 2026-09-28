import type { ReactNode } from 'react';
import { Typography } from '../typography';

type CaseFeaturedTechnologiesProps = { children: ReactNode };

const technologiesStyles = { color: 'text.secondary', fontSize: 'var(--site-text-sm)' };

export function CaseFeaturedTechnologies(props: CaseFeaturedTechnologiesProps) {
  return <Typography sx={technologiesStyles}>{props.children}</Typography>;
}
