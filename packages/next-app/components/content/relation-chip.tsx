'use client';

import Chip from '@mui/material/Chip';
import type { ReferenceRelation } from '@portfolio/content/types';
import { NavLink } from '../primitives/nav-link';

type RelationChipProps = { relation: ReferenceRelation };

export function RelationChip(props: RelationChipProps) {
  const { relation } = props;
  return (
    <Chip
      component={NavLink}
      href={`/findings/${relation.targetSlug}`}
      title={relation.note}
      label={relation.targetTitle}
      clickable
      size="small"
      variant="outlined"
    />
  );
}
