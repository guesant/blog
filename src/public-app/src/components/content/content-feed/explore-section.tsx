'use client';

import { ExplorationSection, ExplorationTileGrid } from '../exploration-section';
import { featureFlags } from '@portfolio/data/config/feature-flags';
import type { IconName } from '../../primitives/icon';
import { ExploreTile } from './explore-tile';

type ExploreSectionProps = { t: (key: string) => string };

export function ExploreSection(props: ExploreSectionProps) {
  const { t } = props;

  const tiles: { icon: IconName; label: string; href: string }[] = [
    { icon: 'pen-line', label: t('writing'), href: '/writing' },
    { icon: 'solution', label: t('findings'), href: '/findings' },
    { icon: 'archive', label: t('collections'), href: '/collections' },
    { icon: 'layout-grid', label: t('topics'), href: '/topics' },
    { icon: 'folder-git', label: t('projects'), href: '/projects' },
    { icon: 'briefcase', label: t('cases'), href: '/cases' },
    ...(featureFlags.tools ? [{ icon: 'wrench' as const, label: t('tools'), href: '/tools' }] : []),
  ];

  return (
    <ExplorationSection title={t('exploreMoreTitle')} divider>
      <ExplorationTileGrid>
        {tiles.map((tile) => (
          <ExploreTile key={tile.href} tile={tile} />
        ))}
      </ExplorationTileGrid>
    </ExplorationSection>
  );
}
