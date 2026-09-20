import type { ReferenceRelation } from '@portfolio/data/domain/types';

export type ConnectionsSectionProps = { relations: ReferenceRelation[] };

export function groupByLabel(relations: ReferenceRelation[]): Map<string, ReferenceRelation[]> {
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
