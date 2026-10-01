import { useRef } from 'react';
import { HeroTechnicalGridSurface } from '../ui';
import { useGridPointer } from './use-grid-pointer';

export type HeroTechnicalGridProps = Record<string, never>;

export function HeroTechnicalGrid(props: HeroTechnicalGridProps) {
  void props;

  const gridRef = useRef<HTMLDivElement>(null);

  useGridPointer(gridRef, false);

  return <HeroTechnicalGridSurface ref={gridRef} />;
}
