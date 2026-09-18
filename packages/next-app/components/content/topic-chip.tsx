'use client';

import Chip from '@mui/material/Chip';
import { NavLink } from '../primitives/nav-link';

type TopicChipProps = { slug: string; name: string };

export function TopicChip(props: TopicChipProps) {
  const { slug, name } = props;
  return (
    <Chip
      component={NavLink}
      href={`/topics/${slug}`}
      label={name}
      clickable
      size="small"
      variant="outlined"
    />
  );
}
