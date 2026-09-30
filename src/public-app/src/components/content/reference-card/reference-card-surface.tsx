'use client';

import type { ReferenceCardProps } from './types';
import { EditorialReferenceCard } from './editorial-reference-card';
import { TraditionalReferenceCard } from './traditional-reference-card';
import { useSiteFeatureFlags } from '../use-site-feature-flags';

type ReferenceCardSurfaceProps = ReferenceCardProps;

export function ReferenceCardSurface(props: ReferenceCardSurfaceProps) {
  const { feed } = useSiteFeatureFlags();

  return feed.flatCards ? (
    <EditorialReferenceCard {...props} />
  ) : (
    <TraditionalReferenceCard {...props} />
  );
}
