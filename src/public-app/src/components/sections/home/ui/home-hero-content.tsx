import type { ReactNode } from 'react';
import { HomeHeroContentFrame } from '../../../ui/semantic/HomeHeroContentFrame';

type HomeHeroContentProps = {
  children: ReactNode;
};

export function HomeHeroContent(props: HomeHeroContentProps) {
  return <HomeHeroContentFrame>{props.children}</HomeHeroContentFrame>;
}
