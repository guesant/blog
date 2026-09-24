'use client';

import { Chip } from '../ui';
import { NavLink } from '../primitives/nav-link';

type TopicChipProps = { slug: string; name: string; url?: string };

export function TopicChip(props: TopicChipProps) {
  const { slug, name } = props;

  return (
    <Chip
      component={NavLink}
      href={props.url ?? `/topics/${slug}`}
      label={name}
      clickable
      size="small"
      variant="outlined"
    />
  );
}
