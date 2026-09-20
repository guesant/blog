import type { HomeHeroProps } from '../types';
import type { Translator } from '@/i18n/compat-support';
import { homeVisibilityEnabled } from './home-visibility-enabled';

export type HomeHeroRoute = {
  href: string;
  icon: 'user' | 'mail' | 'graduation-cap' | 'search';
  label: string;
  visible: boolean;
};

type BuildHomeHeroRoutesProps = Pick<HomeHeroProps, 'site' | 'showContact' | 't'>;

export function buildHomeHeroRoutes(
  props: BuildHomeHeroRoutesProps,
  tNav: Translator,
): HomeHeroRoute[] {
  return [
    {
      href: '/about',
      icon: 'user',
      label: props.t('aboutMe'),
      visible: homeVisibilityEnabled(props.site.visibility, 'about'),
    },
    {
      href: '/contact',
      icon: 'mail',
      label: tNav('contact'),
      visible: props.showContact && homeVisibilityEnabled(props.site.visibility, 'contact'),
    },
    {
      href: '/resume',
      icon: 'graduation-cap',
      label: tNav('resume'),
      visible: homeVisibilityEnabled(props.site.visibility, 'resume'),
    },
    {
      href: '/findings',
      icon: 'search',
      label: tNav('achados'),
      visible: homeVisibilityEnabled(props.site.visibility, 'findings'),
    },
  ];
}
