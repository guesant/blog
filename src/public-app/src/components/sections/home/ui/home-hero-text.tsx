import { HomeHeroTextBody } from './home-hero-text-body';
import { HomeHeroTextLocation } from './home-hero-text-location';
import { HomeHeroTextTitle } from './home-hero-text-title';
import type { HomeHeroTextProps } from './home-hero-text.types';

export function HomeHeroText(props: HomeHeroTextProps) {
  let TextComponent = HomeHeroTextBody;

  if (props.kind === 'title') {
    TextComponent = HomeHeroTextTitle;
  }

  if (props.kind === 'location') {
    TextComponent = HomeHeroTextLocation;
  }

  return <TextComponent {...props} />;
}
