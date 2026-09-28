import type { ReactNode } from 'react';
import { Card } from '../card';

type FollowEntryCardFrameProps = {
  href?: string;
  children: ReactNode;
};

const frameStyles = {
  padding: 'var(--site-inset-card)',
  color: 'inherit',
  textDecoration: 'none',
  borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
};

export function FollowEntryCardFrame(props: FollowEntryCardFrameProps) {
  return (
    <Card
      component={props.href ? 'a' : 'article'}
      href={props.href}
      variant="outlined"
      sx={frameStyles}
    >
      {props.children}
    </Card>
  );
}
