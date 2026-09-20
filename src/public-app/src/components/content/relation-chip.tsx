'use client';

import { Chip } from '../ui';
import type { ReferenceRelation } from '@portfolio/data/domain/types';
import { NavLink } from '../primitives/nav-link';

type RelationChipProps = { relation: ReferenceRelation };

export function RelationChip(props: RelationChipProps) {
  const { relation } = props;

  return (
    <Chip
      component={NavLink}
      href={relation.targetUrl ?? `/findings/${relation.targetSlug}`}
      title={relation.note}
      label={relation.targetTitle}
      clickable
      size="small"
      variant="outlined"
    />
  );
}
