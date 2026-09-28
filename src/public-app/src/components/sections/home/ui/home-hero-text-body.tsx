import type { HomeHeroTextProps } from './home-hero-text.types';
import { HomeIntroText } from '../../../ui/semantic/HomeIntroText';

type HomeHeroTextBodyProps = HomeHeroTextProps;

export function HomeHeroTextBody(props: HomeHeroTextBodyProps) {
  return <HomeIntroText component="p">{props.children}</HomeIntroText>;
}
