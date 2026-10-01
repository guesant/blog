import { useRef } from 'react';
import { PanelTechnicalGridSurface } from '../ui';
import { useGridPointer } from './use-grid-pointer';

export type PanelTechnicalGridProps = Record<string, never>;

export function PanelTechnicalGrid(props: PanelTechnicalGridProps) {
  void props;

  const gridRef = useRef<HTMLDivElement>(null);

  useGridPointer(gridRef, true);

  return <PanelTechnicalGridSurface ref={gridRef} />;
}
