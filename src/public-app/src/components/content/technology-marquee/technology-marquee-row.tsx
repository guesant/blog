'use client';

import { TechnologyMarqueeSurface } from '../../ui';
import { trackClass, cloneClass, marqueeDuration, type TechnologyMarqueeRowProps } from './types';
import { TechnologyChip } from './technology-chip';

export function TechnologyMarqueeRow(props: TechnologyMarqueeRowProps) {
  const { technologies, reverse = false } = props;

  if (technologies.length === 0) {
    return null;
  }

  const chips = technologies.map((technology) => (
    <TechnologyChip key={technology.slug} technology={technology} />
  ));

  return (
    <TechnologyMarqueeSurface
      cloneClass={cloneClass}
      duration={marqueeDuration(technologies.length)}
      reverse={reverse}
      trackClass={trackClass}
    >
      {chips}
    </TechnologyMarqueeSurface>
  );
}
