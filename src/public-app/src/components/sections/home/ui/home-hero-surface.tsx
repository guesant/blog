import type { ReactNode } from 'react';
import { HomeHeroSurfaceFrame } from '../../../ui/semantic/HomeHeroSurfaceFrame';
import { HomeHeroSurfaceWithContactFrame } from '../../../ui/semantic/HomeHeroSurfaceWithContactFrame';

type HomeHeroSurfaceProps = {
  children: ReactNode;
  showContact: boolean;
};

export function HomeHeroSurface(props: HomeHeroSurfaceProps) {
  const Frame = props.showContact ? HomeHeroSurfaceWithContactFrame : HomeHeroSurfaceFrame;

  return <Frame>{props.children}</Frame>;
}
