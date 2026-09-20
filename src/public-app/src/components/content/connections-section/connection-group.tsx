'use client';

import { Box, Typography } from '../../ui';
import { RelationChip } from '../relation-chip';
import type { ReferenceRelation } from '@portfolio/data/domain/types';

type ConnectionGroupProps = { label: string; items: ReferenceRelation[] };

export function ConnectionGroup(props: ConnectionGroupProps) {
  const { label, items } = props;

  return (
    <Box>
      <Typography visualVariant="connectionGroup">{label}</Typography>
      <Box visualVariant="connectionGroup">
        {items.map((relation) => (
          <RelationChip
            key={`${relation.relationType}-${relation.direction}-${relation.targetSlug}`}
            relation={relation}
          />
        ))}
      </Box>
    </Box>
  );
}
