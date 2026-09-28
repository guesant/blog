'use client';

import { Box } from '../../ui';
import { RelationChip } from '../relation-chip';
import type { ReferenceRelation } from '@portfolio/data/domain/types';
import { ConnectionGroupFrame } from '../../ui/semantic/ConnectionGroupFrame';
import { ConnectionGroupText } from '../../ui/semantic/ConnectionGroupText';

type ConnectionGroupProps = { label: string; items: ReferenceRelation[] };

export function ConnectionGroup(props: ConnectionGroupProps) {
  const { label, items } = props;

  return (
    <Box>
      <ConnectionGroupText>{label}</ConnectionGroupText>
      <ConnectionGroupFrame>
        {items.map((relation) => (
          <RelationChip
            key={`${relation.relationType}-${relation.direction}-${relation.targetSlug}`}
            relation={relation}
          />
        ))}
      </ConnectionGroupFrame>
    </Box>
  );
}
