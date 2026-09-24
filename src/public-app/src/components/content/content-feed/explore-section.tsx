'use client';

import { ExplorationSection, ExplorationTileGrid } from '../exploration-section';
import type { IconName } from '../../primitives/icon';
import { ExploreTile } from './explore-tile';
import { useTranslations } from '@/i18n/compat';

export function ExploreSection() {
  const t = useTranslations('Common');

  const tiles: { icon: IconName; label: string; href: string }[] = [
    { icon: 'pen-line', label: t('writing'), href: '/writing' },
    { icon: 'solution', label: t('findings'), href: '/findings' },
    { icon: 'archive', label: t('collections'), href: '/collections' },
    { icon: 'layout-grid', label: t('topics'), href: '/topics' },
    { icon: 'folder-git', label: t('projects'), href: '/projects' },
    { icon: 'briefcase', label: t('cases'), href: '/cases' },
  ];

  return (
    <ExplorationSection title={t('continueExploring')} divider>
      <ExplorationTileGrid>
        {tiles.map((tile) => (
          <ExploreTile key={tile.href} tile={tile} />
        ))}
      </ExplorationTileGrid>
    </ExplorationSection>
  );
}
