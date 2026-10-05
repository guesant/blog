'use client';

import { ExplorationSection, ExplorationTileGrid } from '../exploration-section';
import type { IconName } from '../../primitives/icon';
import { ExploreTile } from './explore-tile';
import { useTranslations } from '@/i18n/compat';
import { useLocale } from '@/i18n/compat';
import { localizedPath } from '@/i18n/navigation-localized-path';
import { ConditionalContent } from '../../primitives/conditional-content';
import { useSiteNavigation } from '../use-site-navigation';
import { exploreTileIsInSidebar } from './explore-tile-is-in-sidebar';

export function ExploreSection() {
  const t = useTranslations('Common');

  const locale = useLocale();

  const navigation = useSiteNavigation();

  const tiles: { icon: IconName; label: string; href: string }[] = [
    { icon: 'pen-line', label: t('writing'), href: '/writing' },
    { icon: 'solution', label: t('findings'), href: '/findings' },
    { icon: 'archive', label: t('collections'), href: '/collections' },
    { icon: 'layout-grid', label: t('topics'), href: '/topics' },
    { icon: 'folder-git', label: t('projects'), href: '/projects' },
    { icon: 'briefcase', label: t('cases'), href: '/cases' },
  ];

  const visibleTiles = tiles.filter((tile) =>
    exploreTileIsInSidebar(navigation, localizedPath(tile.href, locale)),
  );

  return (
    <ConditionalContent
      condition={visibleTiles.length > 0}
      content={
        <ExplorationSection title={t('continueExploring')} divider>
          <ExplorationTileGrid>
            {visibleTiles.map((tile) => (
              <ExploreTile key={tile.href} tile={tile} />
            ))}
          </ExplorationTileGrid>
        </ExplorationSection>
      }
    />
  );
}
