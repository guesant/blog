'use client';

import { Chip } from '../ui';
import { NavLink } from '../primitives/nav-link';

type TopicChipProps = { slug?: string; name: string; url?: string };

export function TopicChip(props: TopicChipProps) {
  const href = props.url ?? (props.slug ? `/topics/${props.slug}` : undefined);

  return (
    <Chip
      {...(href ? { component: NavLink, href, clickable: true } : {})}
      label={props.name}
      size="small"
      variant="outlined"
    />
  );
}
