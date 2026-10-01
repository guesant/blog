import type { ReactNode } from 'react';
import { HomeHeroSurfaceFrame } from '../../../ui/semantic/HomeHeroSurfaceFrame';
import { HomeHeroSurfaceWithContactFrame } from '../../../ui/semantic/HomeHeroSurfaceWithContactFrame';

type HomeHeroSurfaceProps = {
  children: ReactNode;
  showContact: boolean;
};

export function HomeHeroSurface(props: HomeHeroSurfaceProps) {
  if (props.showContact) {
    return <HomeHeroSurfaceWithContactFrame children={props.children} />;
  }

  return <HomeHeroSurfaceFrame children={props.children} />;
}
