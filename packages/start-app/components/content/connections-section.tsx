'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReferenceRelation } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import { RelationChip } from './relation-chip';

type ConnectionsSectionProps = { relations: ReferenceRelation[] };

function groupByLabel(relations: ReferenceRelation[]): Map<string, ReferenceRelation[]> {
  const groups = new Map<string, ReferenceRelation[]>();
  for (const relation of relations) {
    const group = groups.get(relation.label);
    if (group) {
      group.push(relation);
    } else {
      groups.set(relation.label, [relation]);
    }
  }
  return groups;
}

export function ConnectionsSection(props: ConnectionsSectionProps) {
  const { relations } = props;
  const t = useTranslations('Pages.achados');

  if (relations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 5, pt: 5, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {t('connectionsHeading')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[...groupByLabel(relations)].map(([label, items]) => (
          <Box key={label}>
            <Typography sx={{ fontWeight: 600, mb: 1, textTransform: 'capitalize' }}>
              {label}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {items.map((relation) => (
                <RelationChip
                  key={`${relation.relationType}-${relation.direction}-${relation.targetSlug}`}
                  relation={relation}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
