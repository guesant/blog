import { useTranslations } from '@/i18n/compat';
import { buildHomeHeroRoutes } from './build-home-hero-routes';
import type { HomeHeroActionsProps } from './home-hero-actions.types';
import { HomeHeroNavigationButton } from './home-hero-navigation-button';
import { HomeHeroActionsFrame } from '../../../ui/semantic/HomeHeroActionsFrame';

export function HomeHeroActions(props: HomeHeroActionsProps) {
  const tNav = useTranslations('Nav');

  const routes = buildHomeHeroRoutes(props, tNav);

  return (
    <HomeHeroActionsFrame>
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
    </HomeHeroActionsFrame>
  );
}
