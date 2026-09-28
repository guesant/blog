import type { ReactNode } from 'react';
import { Card } from '../card';

type CaseFeaturedCardFrameProps = { children: ReactNode };

const featuredStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
  minHeight: { md: '21.5rem' },
  overflow: 'hidden',
  backgroundColor: 'background.paper',
};

export function CaseFeaturedCardFrame(props: CaseFeaturedCardFrameProps) {
  return <Card sx={featuredStyles}>{props.children}</Card>;
}
