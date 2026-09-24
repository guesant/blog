import { HomeHeroTextBody } from './home-hero-text-body';
import { HomeHeroTextTitle } from './home-hero-text-title';
import type { HomeHeroTextProps } from './home-hero-text.types';

export function HomeHeroText(props: HomeHeroTextProps) {
  let TextComponent = HomeHeroTextBody;

  if (props.kind === 'title') {
    TextComponent = HomeHeroTextTitle;
  }

  return <TextComponent {...props} />;
}
