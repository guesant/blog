import type { HomeHeroTextProps } from './home-hero-text.types';
import { HomeHeroTitleText } from '../../../ui/semantic/HomeHeroTitleText';

type HomeHeroTextTitleProps = HomeHeroTextProps;

export function HomeHeroTextTitle(props: HomeHeroTextTitleProps) {
  return <HomeHeroTitleText variant="h1">{props.children}</HomeHeroTitleText>;
}
