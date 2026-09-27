import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeHeroContentProps = {
  children: ReactNode;
};

export function HomeHeroContent(props: HomeHeroContentProps) {
  return <Box visualVariant="homeHeroContent">{props.children}</Box>;
}
