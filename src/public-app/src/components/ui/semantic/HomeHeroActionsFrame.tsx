import type { ComponentProps } from 'react';
import { ExplorationTileGridFrame } from './ExplorationTileGridFrame';
import { mergeSx } from '@/components/ui/sx';

type HomeHeroActionsFrameProps = ComponentProps<typeof ExplorationTileGridFrame>;

export function HomeHeroActionsFrame(props: HomeHeroActionsFrameProps) {
  const Component = ExplorationTileGridFrame;

  return <Component {...props} sx={mergeSx({ mt: 0 }, props.sx)} />;
}
