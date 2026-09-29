import type { ComponentProps } from 'react';
import {
  explorationTileGridGapProperty,
  ExplorationTileGridFrame,
} from './ExplorationTileGridFrame';
import { mergeSx } from '@/components/ui/sx';

type HomeHeroActionsFrameProps = ComponentProps<typeof ExplorationTileGridFrame>;

export function HomeHeroActionsFrame(props: HomeHeroActionsFrameProps) {
  const Component = ExplorationTileGridFrame;

  return (
    <Component
      {...props}
      sx={mergeSx({ mt: 0, [explorationTileGridGapProperty]: 'var(--site-space-3)' }, props.sx)}
    />
  );
}
