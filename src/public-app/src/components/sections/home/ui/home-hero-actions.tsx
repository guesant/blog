import { ExplorationTileGrid } from '../../../content/exploration-section';
import { useTranslations } from '@/i18n/compat';
import { buildHomeHeroRoutes } from './build-home-hero-routes';
import type { HomeHeroActionsProps } from './home-hero-actions.types';
import { HomeHeroSelectedWork } from './home-hero-selected-work';
import { HomeHeroNavigationButton } from './home-hero-navigation-button';
import { ConditionalContent } from '../../../primitives/conditional-content';

export function HomeHeroActions(props: HomeHeroActionsProps) {
  const tNav = useTranslations('Nav');

  const routes = buildHomeHeroRoutes(props, tNav);

  return (
    <ExplorationTileGrid>
      <ConditionalContent
        condition={Boolean(props.workTarget)}
        content={
          <HomeHeroSelectedWork href={props.workTarget ?? '#'} label={props.t('selectedWork')} />
        }
      />
      {routes
        .filter((route) => route.visible)
        .map((route) => (
          <HomeHeroNavigationButton
            key={route.href}
            href={route.href}
            icon={route.icon}
            label={route.label}
          />
        ))}
    </ExplorationTileGrid>
  );
}
